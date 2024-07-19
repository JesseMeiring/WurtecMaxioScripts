/*declare all relevant elements*/
let form = $("form:first");
let phone = $("#subscription_customer_attributes_phone");
let organization = $("#subscription_customer_attributes_organization");
let updateTotalsButton = $("#form__section-apply-components");
let submitbtn = $("#subscription_submit");

$(document).ready(function () {
  let phoneLabel = $('label[for="subscription_customer_attributes_phone"]');
  phoneLabel.text(phoneLabel.text() + " *");
  let organizationLabel = $(
    'label[for="subscription_customer_attributes_organization"]'
  );
  organizationLabel.text(organizationLabel.text() + " *");
});

submitbtn.click(function () {
  //Checks for errors, if found will not allow for submission
  let errorsCheck = false;
  if (phoneLessThanTenDigits(phone)) {
    setError(phone, "Must be at least 10 digits");
    errorsCheck = true;
  }
  if (orgBlank(organization)) {
    setError(organization, "Cannot be blank");
    errorsCheck = true;
  }
  if (errorsCheck) {
    setError(submitbtn, "Errors found. Please review form and try again");
  }
  return !errorsCheck;
});

phone.blur(function () {
  if ($(this).val() !== "") {
    $(this).removeClass("field-error");
  } else {
    $(this).addClass("field-error");
  }
});

orgfield.blur(function () {
  if (orgBlank($(this))) {
    setError($(this), "Cannot be blank");
  } else {
    removeAllErrors($(this));
  }
});

function updateTotals() {
  updateTotalsButton.click();
}

function phoneLessThanTenDigits(phoneElement) {
  return phoneElement.val().length < 10;
}

function orgBlank(orgElement) {
  return orgElement.val() === "";
}

//Generic functions (not all used)

function setError(targetElement, errors) {
  removeAllErrors(targetElement);
  targetElement.parent().addClass("has-error");
  targetElement.parent().append(`<p class="error-message">${errors}</p>`);
}

function removeAllErrors(targetElement) {
  targetElement.parent().removeClass("has-error");
  targetElement.parent().children(".error-message").remove();
}

function setCustomFieldError(targetElement, error) {
  targetElement.parent().parent().parent().addClass("has-error");
  if (!customErrorPresent(targetElement, error)) {
    targetElement
      .parent()
      .append(`<span class="error-message" style="color:red;">${error}</span>`);
  }
}

function customErrorPresent(targetElement, error) {
  let errorMessageSpan = targetElement.parent().find(".error-message");
  present = false;
  errorMessageSpan.each(function () {
    if ($(this).text() === error) {
      present = true;
    }
  });
  return present;
}

function removeAllCustomFieldErrors(targetElement) {
  targetElement.parent().parent().parent().removeClass("has-error");
  targetElement.parent().children(".error-message").remove();
}

function removeSpecificCustomFieldError(targetElement, errorText) {
  for (const child of targetElement.parent().children(".error-message")) {
    if (child.innerText == errorText) child.remove();
  }
  if (targetElement.parent().children(".error-message").length == 0) {
    targetElement.parent().parent().parent().removeClass("has-error");
  }
}

function getComponentField(id) {
  let f = $("#component_allocated_quantity_" + id);
  if(f.length < 1) console.log(`Couldn't find component with id of ${id}`);
  return f
}

function getCustomVariableField(id) {
  let f = $("#subscription_metafields_" + id);
  if(f.length < 1) console.log(`Couldn't find Custom Variable Field with id of ${id}`);
  return f
}

function showHideCustomVariableField(fieldElement, show) {
  if (show) {
    fieldElement.parent().parent().parent().show();
  } else {
    fieldElement.parent().parent().parent().hide();
  }
}
