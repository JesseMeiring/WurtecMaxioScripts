/*declare all relevant elements*/
let form = $("form:first");
let phone = $("#subscription_customer_attributes_phone");
let organization = $("#subscription_customer_attributes_organization");
let submitbtn = $("#subscription_submit");
let SaaSField = getComponentField("2264802");
let WurLinkField = getComponentField("2314160");
let WurLinkFieldVerizon = getComponentField("2491155");
let WurtecWatchField = getComponentField("2314161");
let carStationDesignationFields = [
  getCustomVariableField("56036"),
  getCustomVariableField("56038"),
  getCustomVariableField("56040"),
  getCustomVariableField("56042"),
  getCustomVariableField("56044"),
  getCustomVariableField("56046"),
  getCustomVariableField("56048"),
  getCustomVariableField("56050"),
];
let carStationSerialFields = [
  getCustomVariableField("56035"),
  getCustomVariableField("56037"),
  getCustomVariableField("56039"),
  getCustomVariableField("56041"),
  getCustomVariableField("56043"),
  getCustomVariableField("56045"),
  getCustomVariableField("56047"),
  getCustomVariableField("56049"),
];
let lobbyStationDesignnationFields = [
  getCustomVariableField("56051"),
  getCustomVariableField("56053"),
  getCustomVariableField("56055"),
  getCustomVariableField("56057"),
];
let lobbyStationSerialFields = [
  getCustomVariableField("56052"),
  getCustomVariableField("56054"),
  getCustomVariableField("56056"),
  getCustomVariableField("56058"),
];
let simCardFields = [
  getCustomVariableField("56029"),
  getCustomVariableField("56030"),
  getCustomVariableField("56031"),
  getCustomVariableField("56032"),
  getCustomVariableField("56033"),
  getCustomVariableField("56034"),
];
let monitoringServiceFields = [
  getCustomVariableField("56026"),
  getCustomVariableField("56027"),
];
let siteContact = getCustomVariableField("57343");
let siteContactPhone = getCustomVariableField("57344");
let siteContactEmail = getCustomVariableField("57345");
let qtyZeroEMessage = "Saas quantity must be a positive number";
let qtyAddOnMessage = "Add Ons must have a value of zero or greater";
let onlyOneKindMessage = "Only one kind of Wur-Link Add On should be used.";

//Runs as soon as the page is ready
$(document).ready(function () {
  let phoneLabel = $('label[for="subscription_customer_attributes_phone"]');
  phoneLabel.text(phoneLabel.text() + " *");
  let organizationLabel = $(
    'label[for="subscription_customer_attributes_organization"]'
  );
  organizationLabel.text(organizationLabel.text() + " *");
  showHideCarStations();
  showHideLobbyStations();
  showHideSimCards();
  showHideMonitoring();
  showHideSiteInfo();
  SaaSField.val();
});

//This attaches a function to the submitBtn on click
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
  if (!validMainQty(SaaSField.val())) {
    setCustomFieldError(SaaSField, qtyZeroEMessage);
    errorsCheck = true;
  }
  if (!validAddOnQty(WurLinkField.val())) {
    setCustomFieldError(WurLinkField, qtyAddOnMessage);
    errorsCheck = true;
  }
  if (!validAddOnQty(WurLinkFieldVerizon.val())) {
    setCustomFieldError(WurLinkFieldVerizon, qtyAddOnMessage);
    errorsCheck = true;
  }
  if (!onlyOnePositive(WurLinkField.val(), WurLinkFieldVerizon.val())) {
    setCustomFieldError(WurLinkFieldVerizon, onlyOneKindMessage);
    setCustomFieldError(WurLinkFieldVerizon, onlyOneKindMessage);
    errorsCheck = true;
  }
  if (!validAddOnQty(WurtecWatchField.val())) {
    setCustomFieldError(WurtecWatchField, qtyAddOnMessage);
    errorsCheck = true;
  }
  for (let i = 0; i < SaaSField.val(); i++) {
    if (carStationDesignationFields[i].val() == "") {
      setCustomFieldError(carStationDesignationFields[i], "Cannot be blank");
      errorsCheck = true;
    }
    if (carStationSerialFields[i].val() == "") {
      setCustomFieldError(carStationSerialFields[i], "Cannot be blank");
      errorsCheck = true;
    }
  }
  if (errorsCheck) {
    setError(submitbtn, "Errors found. Please review form and try again");
  }
  return !errorsCheck;
});

//Attaches function to phone element when it stops being the focus on the page
//i.e. after it has been changed
phone.blur(function () {
  if (phoneLessThanTenDigits($(this))) {
    setError($(this), "Must be at least 10 digits");
  } else {
    removeAllErrors($(this));
  }
});

//Attaches function to phone element when it stops being the focus on the page
//i.e. after it has been changed
organization.blur(function () {
  if (orgBlank($(this))) {
    setError($(this), "Cannot be blank");
  } else {
    removeAllErrors($(this));
  }
});

//When Wur-Link qty is changed
WurLinkField.blur(function () {
  showHideSimCards();
  if (!validAddOnQty($(this).val())) {
    setCustomFieldError($(this), qtyAddOnMessage);
  } else {
    removeSpecificCustomFieldError($(this), qtyAddOnMessage);
  }
  if (!onlyOnePositive($(this).val(), WurLinkFieldVerizon.val())) {
    setCustomFieldError($(this), onlyOneKindMessage);
    setCustomFieldError(WurLinkFieldVerizon, onlyOneKindMessage);
  } else {
    removeSpecificCustomFieldError($(this), onlyOneKindMessage);
    removeSpecificCustomFieldError(WurLinkFieldVerizon, onlyOneKindMessage);
  }
});

//When Wur-Link Verizon qty is changed
WurLinkFieldVerizon.blur(function () {
  showHideSimCards();
  if (!validAddOnQty($(this).val())) {
    setCustomFieldError($(this), qtyAddOnMessage);
  } else {
    removeSpecificCustomFieldError($(this), qtyAddOnMessage);
  }
  if (!onlyOnePositive($(this).val(), WurLinkField.val())) {
    setCustomFieldError($(this), onlyOneKindMessage);
    setCustomFieldError(WurLinkField, onlyOneKindMessage);
  } else {
    removeSpecificCustomFieldError($(this), onlyOneKindMessage);
    removeSpecificCustomFieldError(WurLinkField, onlyOneKindMessage);
  }
});

//When SaaS qty is changed
SaaSField.blur(function () {
  showHideCarStations();
  if (!validMainQty($(this).val())) {
    setCustomFieldError($(this), qtyZeroEMessage);
  } else {
    removeSpecificCustomFieldError(SaaSField, qtyZeroEMessage);
  }
});

//When Wurtec Watch qty is changed
WurtecWatchField.blur(function () {
  showHideMonitoring();
  showHideSiteInfo();
  if (!validAddOnQty($(this).val())) {
    setCustomFieldError($(this), qtyAddOnMessage);
  } else {
    removeSpecificCustomFieldError($(this), qtyAddOnMessage);
  }
});

//attach check to all Car Stations
for (let i = 0; i < carStationDesignationFields.length; i++) {
  carStationDesignationFields[i].blur(function () {
    if (carStationDesignationFields[i].val() != "" || SaaSField.val() <= i) {
      removeAllCustomFieldErrors(carStationDesignationFields[i]);
    } else {
      setCustomFieldError(carStationDesignationFields[i], "Cannot be blank");
    }
  });
  carStationSerialFields[i].blur(function () {
    if (carStationSerialFields[i].val() != "" || SaaSField.val() <= i) {
      removeAllCustomFieldErrors(carStationSerialFields[i]);
    } else {
      setCustomFieldError(carStationSerialFields[i], "Cannot be blank");
    }
  });
}

//Whenever any lobby station field changes
for (let i = 0; i < lobbyStationDesignnationFields.length; i++) {
  lobbyStationDesignnationFields[i].blur(function () {
    showHideLobbyStations();
  });
  lobbyStationSerialFields[i].blur(function () {
    showHideLobbyStations();
  });
}

function phoneLessThanTenDigits(phoneElement) {
  return phoneElement.val().length < 10;
}

function orgBlank(orgElement) {
  return orgElement.val() === "";
}

function validMainQty(fieldValue) {
  return validAddOnQty(fieldValue) && greaterThanZero(fieldValue);
}

function validAddOnQty(fieldValue) {
  return (
    numericValue(fieldValue) &&
    positiveValue(fieldValue) &&
    !decimalValue(fieldValue)
  );
}

function decimalValue(fieldValue) {
  let fieldvalInt = parseInt(fieldValue);
  let fieldvalFloat = parseFloat(fieldValue);
  return fieldvalFloat != fieldvalInt;
}

function positiveValue(fieldValue) {
  return parseInt(fieldValue) >= 0;
}

function greaterThanZero(fieldValue) {
  return parseInt(fieldValue) > 0;
}

function numericValue(fieldValue) {
  return !isNaN(parseInt(fieldValue));
}

function onlyOnePositive(f1, f2) {
  console.log(f1);
  console.log(f2);
  return !(parseInt(f1) > 0 && parseInt(f2) > 0);
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
  return $("#component_allocated_quantity_" + id);
}

function getCustomVariableField(id) {
  return $("#subscription_metafields_" + id);
}

function showHideCustomVariableField(fieldElement, show) {
  if (show) {
    fieldElement.parent().parent().parent().show();
  } else {
    fieldElement.parent().parent().parent().hide();
  }
}

function showHideCarStations() {
  for (let i = 0; i < carStationDesignationFields.length; i++) {
    showHideCustomVariableField(
      carStationDesignationFields[i],
      SaaSField.val() > i
    );
    showHideCustomVariableField(carStationSerialFields[i], SaaSField.val() > i);
  }
}

function showHideLobbyStations() {
  let shown = true;
  for (let i = 0; i < lobbyStationDesignnationFields.length; i++) {
    showHideCustomVariableField(
      lobbyStationDesignnationFields[i],
      i == 0 || shown
    );
    showHideCustomVariableField(lobbyStationSerialFields[i], i == 0 || shown);
    if (shown)
      shown =
        lobbyStationDesignnationFields[i].val() != "" ||
        lobbyStationSerialFields[i].val() != "";
  }
}

function showHideSimCards() {
  let cardCount = 0;
  if (WurLinkField.val() > WurLinkFieldVerizon.val()) {
    cardCount = WurLinkField.val();
  } else {
    cardCount = WurLinkFieldVerizon.val();
  }
  for (let i = 0; i < simCardFields.length; i++) {
    showHideCustomVariableField(simCardFields[i], cardCount > i);
  }
}

function showHideMonitoring() {
  for (let i = 0; i < monitoringServiceFields.length; i++) {
    showHideCustomVariableField(
      monitoringServiceFields[i],
      WurtecWatchField.val() == 0
    );
  }
}

function showHideSiteInfo() {
  showHideCustomVariableField(siteContact, WurtecWatchField.val() > 0);
  showHideCustomVariableField(siteContactPhone, WurtecWatchField.val() > 0);
  showHideCustomVariableField(siteContactEmail, WurtecWatchField.val() > 0);
}
