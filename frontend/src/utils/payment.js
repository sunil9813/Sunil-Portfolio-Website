export const submitEsewaForm = (paymentUrl, formData = {}) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;
  form.target = "_self";
  form.acceptCharset = "UTF-8";
  form.style.display = "none";

  Object.entries(formData).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  });

  document.body.appendChild(form);
  HTMLFormElement.prototype.submit.call(form);
};
