export class Helpers{
    static toFormData(dto: Record<string, any>): FormData {

    const form = new FormData();

    Object.entries(dto).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (v === null || v === undefined) return;
          form.append(`${key}[${i}]`, v instanceof File ? v : String(v));
        });
        return;
      }

      if (value instanceof File) {
        form.append(key, value);
        return;
      }

      if (typeof value === 'object') {
        form.append(key, JSON.stringify(value));
        return;
      }

      form.append(key, String(value));
    });

    return form;
  }
   
}