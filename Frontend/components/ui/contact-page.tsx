"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, LucideIcon, Mail, MapPin, Phone } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

const APP_EMAIL = "contact@gofest.com";
const APP_PHONE = "+91 123 456 7890";
const APP_PHONE_2 = "+91 987 654 3210";

export function ContactPageSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16">
        <div className="mb-10">
          <h1
            className="text-3xl md:text-4xl font-semibold text-black"
            style={{ fontFamily: "var(--font-audiowide)" }}
          >
            Contact Us
          </h1>
          <p className="text-black text-base mt-3 max-w-2xl">
            Reach out to the Gofest.com team for partnerships, support, or any
            queries about hosting and discovering college fests.
          </p>
        </div>

        <div className="grid md:grid-cols-3 rounded-xl border overflow-hidden bg-white">
          <ContactBox
            icon={Mail}
            title="Email"
            description="We usually respond within 24 hours."
          >
            <a
              href={`mailto:${APP_EMAIL}`}
              className="font-mono text-base font-medium tracking-wide hover:underline text-black"
            >
              {APP_EMAIL}
            </a>
            <CopyButton className="size-6" text={APP_EMAIL} />
          </ContactBox>

          <ContactBox
            icon={MapPin}
            title="Office"
            description="Based in India. Building for every campus."
          >
            <span className="font-mono text-base font-medium tracking-wide text-black">
              India (Remote-first team)
            </span>
          </ContactBox>

          <ContactBox
            icon={Phone}
            title="Phone"
            description="Available Mon–Fri, 10am–6pm."
            className="md:border-r-0"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-x-2">
                <a
                  href={`tel:${APP_PHONE}`}
                  className="block font-mono text-base font-medium tracking-wide hover:underline text-black"
                >
                  {APP_PHONE}
                </a>
                <CopyButton className="size-6" text={APP_PHONE} />
              </div>
              <div className="flex items-center gap-x-2">
                <a
                  href={`tel:${APP_PHONE_2}`}
                  className="block font-mono text-base font-medium tracking-wide hover:underline text-black"
                >
                  {APP_PHONE_2}
                </a>
                <CopyButton className="size-6" text={APP_PHONE_2} />
              </div>
            </div>
          </ContactBox>
        </div>

      </div>
    </section>
  );
}

type ContactBoxProps = React.ComponentProps<"div"> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

function ContactBox({
  icon: Icon,
  title,
  description,
  className,
  children,
  ...props
}: ContactBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between border-b md:border-b-0 md:border-r last:border-r-0",
        className
      )}
      {...props}
    >
      <div className="bg-gray-50 flex items-center gap-x-3 border-b p-4">
        <Icon className="text-gray-500 size-5" strokeWidth={1} />
        <h2 className="text-lg font-medium tracking-wider text-black">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-x-2 p-4 py-10">{children}</div>
      <div className="border-t p-4">
        <p className="text-black text-sm">{description}</p>
      </div>
    </div>
  );
}

type CopyButtonProps = ButtonProps & {
  text: string;
};

function CopyButton({
  className,
  variant = "ghost",
  size = "icon",
  text,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("disabled:opacity-100", className)}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      disabled={copied || props.disabled}
      {...props}
    >
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="size-3.5 stroke-emerald-500" aria-hidden="true" />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy aria-hidden="true" className="size-3.5" />
      </div>
    </Button>
  );
}


