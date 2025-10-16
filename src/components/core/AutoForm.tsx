import React from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FieldErrors,
} from "react-hook-form";

type AutoFormProps<T extends FieldValues> = {
  defaultValues: T;
  onSubmit: SubmitHandler<T>;
  enums?: Record<string, string[]>;
};

/**
 * Recursive AutoForm that now correctly handles nested dot-paths and enum selects.
 */
export function AutoForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  enums = {},
}: AutoFormProps<T>) {
  const form = useForm<T>({
    defaultValues,
    mode: "onChange",
  });

  // Safely get nested value by path (e.g. "address.neighborhood")
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  // Renders an input or select field
  const renderField = (name: string, value: any) => {
    const enumOptions = enums[name];
    const currentValue = getNestedValue(defaultValues, name);

    if (enumOptions) {
      return (
        <select
          {...form.register(name as any)}
          defaultValue={currentValue ?? ""}
          className="border rounded p-1 w-full"
        >
          <option value="">Select...</option>
          {enumOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          {...form.register(name as any)}
          defaultChecked={currentValue ?? false}
          className="mr-2"
        />
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          {...form.register(name as any, { valueAsNumber: true })}
          defaultValue={currentValue ?? ""}
          className="border rounded p-1 w-full"
        />
      );
    }

    if (typeof value === "string" || value == null) {
      return (
        <input
          type="text"
          {...form.register(name as any)}
          defaultValue={currentValue ?? ""}
          className="border rounded p-1 w-full"
        />
      );
    }

    if (Array.isArray(value)) {
      return (
        <textarea
          {...form.register(name as any)}
          defaultValue={Array.isArray(currentValue) ? currentValue.join(", ") : ""}
          placeholder="Comma-separated values"
          className="border rounded p-1 w-full"
        />
      );
    }

    return null;
  };

  // Recursive rendering for nested objects
  const renderObject = (prefix: string, obj: any): React.ReactNode => {
    if (!obj || typeof obj !== "object") return null;

    return Object.entries(obj).map(([key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (val && typeof val === "object" && !Array.isArray(val)) {
        return (
          <fieldset key={path} className="border rounded-lg p-3 my-3 bg-gray-50">
            <legend className="font-semibold text-gray-700 px-1">{key}</legend>
            {renderObject(path, val)}
          </fieldset>
        );
      }

      return (
        <div key={path} className="my-2">
          <label className="block font-medium text-gray-700 mb-1">{key}</label>
          {renderField(path, val)}
          {form.formState.errors && (
            <p className="text-sm text-red-600 mt-1">
              {(form.formState.errors as FieldErrors<T>)[path]?.message?.toString() || ""}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        // Convert any comma-separated arrays back to real arrays
        const parseArrays = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(parseArrays);
          if (typeof obj === "object" && obj !== null) {
            return Object.fromEntries(
              Object.entries(obj).map(([k, v]) => [k, parseArrays(v)])
            );
          }
          if (typeof obj === "string" && obj.includes(",")) {
            return obj.split(",").map((s) => s.trim());
          }
          return obj;
        };
        onSubmit(parseArrays(values));
      })}
      className="space-y-3"
    >
      {renderObject("", defaultValues)}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
