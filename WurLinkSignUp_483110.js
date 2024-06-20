/*declare all relevant elements*/
let form = $("form:first");
let phone = $("#subscription_customer_attributes_phone");
let organization = $("#subscription_customer_attributes_organization");
let submitbtn = $("#subscription_submit");
let WurLinkField = getComponentField("2263988");
let WurtecWatchField = getComponentField("2314166");
let simCardFields = [
	getCustomVariableField("56029"), 
	getCustomVariableField("56030"), 
	getCustomVariableField("56031"), 
	getCustomVariableField("56032"), 
	getCustomVariableField("56033"), 
	getCustomVariableField("56034")
]
let qtyZeroEMessage = "Wur-Link quantity must be a positive number";
let qtyAddOnMessage = "Add Ons must have a value of zero or greater";


//Runs as soon as the page is ready
$(document).ready(function(){
	let phoneLabel = $('label[for="subscription_customer_attributes_phone"]');
	phoneLabel.text(phoneLabel.text() + " *");
	let organizationLabel = $('label[for="subscription_customer_attributes_organization"]');
	organizationLabel.text(organizationLabel.text() + " *");
	showHideSimCards();
});

//This attaches a function to the submitBtn on click
submitbtn.click(function(){
	//Checks for errors, if found will not allow for submission
	let errorsCheck = false
	if (phoneLessThanTenDigits(phone)) {
		setError(phone, "Must be at least 10 digits")
		errorsCheck = true
    }
	if (orgBlank(organization)) {
		setError(organization, "Cannot be blank")
		errorsCheck = true
	}
	if (!validMainQty(WurLinkField.val())) {
		setCustomFieldError(WurLinkField, qtyZeroEMessage)
		errorsCheck = true
	}
	if(!validAddOnQty(WurtecWatchField.val())) {
		setCustomFieldError(WurtecWatchField, qtyAddOnMessage);
		errorsCheck = true;
	}
	if(errorsCheck) {
		setError(submitbtn, "Errors found. Please review form and try again")
	}
	return !errorsCheck
});

//Attaches function to phone element when it stops being the focus on the page
//i.e. after it has been changed
phone.blur(function(){
	if (phoneLessThanTenDigits($(this))) {
		setError($(this), "Must be at least 10 digits")
	} else {
		removeAllErrors($(this))
	}
});

//Attaches function to phone element when it stops being the focus on the page
//i.e. after it has been changed
organization.blur(function() {
	if (orgBlank($(this))) {
		setError($(this), "Cannot be blank")
	} else {
		removeAllErrors($(this))
	}
});

//When Wur-Link qty is changed
WurLinkField.blur(function() {
	showHideSimCards()	
	if(!validMainQty($(this).val())) {
		setCustomFieldError($(this), qtyZeroEMessage)
	} else {
		removeSpecificCustomFieldError(WurLinkField, qtyZeroEMessage);
	}
});

WurtecWatchField.blur(function() {
	if(!validAddOnQty($(this).val())) {
		setCustomFieldError($(this), qtyAddOnMessage)
	} else {
		removeSpecificCustomFieldError($(this), qtyAddOnMessage);
	}
});

function phoneLessThanTenDigits(phoneElement){
	return phoneElement.val().length < 10
}

function orgBlank(orgElement){
	return orgElement.val() === ""
}

function validMainQty(fieldValue){
	return validAddOnQty(fieldValue) && greaterThanZero(fieldValue);
}

function validAddOnQty(fieldValue){
	return numericValue(fieldValue) && positiveValue(fieldValue) && !decimalValue(fieldValue);
}

function decimalValue(fieldValue){
	let fieldvalInt = parseInt(fieldValue);
	let fieldvalFloat = parseFloat(fieldValue);
	return fieldvalFloat != fieldvalInt;
}

function positiveValue(fieldValue){
	return parseInt(fieldValue) >= 0;
}

function greaterThanZero(fieldValue){
	return parseInt(fieldValue) > 0;
}

function numericValue(fieldValue){
	return !isNaN(parseInt(fieldValue));
}

//Generic functions (not all used)

function setError(targetElement, errors) {
	removeAllErrors(targetElement)
	targetElement.parent().addClass("has-error");
	targetElement.parent().append(`<p class="error-message">${errors}</p>`)
}

function removeAllErrors(targetElement){
	targetElement.parent().removeClass("has-error")
	targetElement.parent().children( ".error-message" ).remove()
}

function setCustomFieldError(targetElement, error) {
	targetElement.parent().parent().parent().addClass("has-error");
	if (!customErrorPresent(targetElement, error)) {
		targetElement.parent().append(`<span class="error-message" style="color:red;">${error}</span>`)
	}
}

function customErrorPresent(targetElement, error) {
	let errorMessageSpan = targetElement.parent().find('.error-message');
	present = false;
	errorMessageSpan.each(function() {
		if ($(this).text() === error) {
			present =  true;
		}
	});
	return present;
}

function removeAllCustomFieldErrors(targetElement){
	targetElement.parent().parent().parent().removeClass("has-error")
	targetElement.parent().children( ".error-message" ).remove()
}

function removeSpecificCustomFieldError(targetElement, errorText) {
	for (const child of targetElement.parent().children( ".error-message" )) {
		if( child.innerText == errorText ) child.remove()
		
	}
	if(targetElement.parent().children( ".error-message" ).length == 0) {
		targetElement.parent().parent().parent().removeClass("has-error")
	}
}

function getComponentField(id) {
	return $("#component_allocated_quantity_"+id)
}

function getCustomVariableField(id) {
	return $("#subscription_metafields_"+id)
}

function showHideCustomVariableField(fieldElement, show) {
	if(show) {
		fieldElement.parent().parent().parent().show()
	} else {
		fieldElement.parent().parent().parent().hide()
	}
}

function showHideSimCards() {
	for(let i = 0; i < simCardFields.length; i++){
		showHideCustomVariableField(simCardFields[i], WurLinkField.val() > i)
	}
}