"use client";

import { useState, type FormEvent } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/Modal";
import type { StoreSettings } from "@/types";

export function SettingsPage() {
  const { settings, hydrated, updateSettings, resetDemo } = useStore();
  const [revision, setRevision] = useState(0);

  if (!hydrated) return <PageSkeleton />;

  return (
    <SettingsForm
      key={revision}
      settings={settings}
      onSave={updateSettings}
      onReset={() => {
        resetDemo();
        setRevision((value) => value + 1);
      }}
    />
  );
}

function SettingsForm({
  settings,
  onSave,
  onReset,
}: {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
  onReset: () => void;
}) {
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const deliveryFee = Number(form.deliveryFee);
    const freeDeliveryThreshold = Number(form.freeDeliveryThreshold);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) return;
    if (!Number.isFinite(freeDeliveryThreshold) || freeDeliveryThreshold < 0) return;
    onSave({
      ...form,
      deliveryFee,
      freeDeliveryThreshold,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    });
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Settings"
        description="Delivery pricing and contact details used across the storefront."
      />
      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Delivery fee (THB)" htmlFor="delivery-fee">
            <TextInput
              id="delivery-fee"
              inputMode="decimal"
              value={form.deliveryFee}
              onChange={(event) => update("deliveryFee", Number(event.target.value))}
            />
          </Field>
          <Field label="Free delivery from (THB)" htmlFor="free-delivery">
            <TextInput
              id="free-delivery"
              inputMode="decimal"
              value={form.freeDeliveryThreshold}
              onChange={(event) => update("freeDeliveryThreshold", Number(event.target.value))}
            />
          </Field>
        </div>
        <Field label="Phone" htmlFor="store-phone">
          <TextInput
            id="store-phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="store-email">
          <TextInput
            id="store-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>
        <Field label="Address" htmlFor="store-address">
          <TextInput
            id="store-address"
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </Field>
        <div className="flex items-center gap-3">
          <Button type="submit">Save settings</Button>
          {saved ? <p className="text-sm text-emerald-700">Saved on this device.</p> : null}
        </div>
      </form>
      <section className="max-w-xl rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-ink">Reset demo data</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Restore the original menu, customers, and orders in the database, and empty the cart on this device.
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => setConfirmReset(true)}>
          Restore sample data
        </Button>
      </section>
      <Modal open={confirmReset} title="Restore sample data" onClose={() => setConfirmReset(false)}>
        <p className="text-sm leading-6 text-muted">
          This replaces foods, categories, customers, and orders in the database with the original sample, and clears the cart on this device.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setConfirmReset(false);
              onReset();
            }}
          >
            Restore
          </Button>
        </div>
      </Modal>
    </div>
  );
}
