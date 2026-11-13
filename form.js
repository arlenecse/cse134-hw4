const form = document.getElementById("jsform");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const commentsInput = document.getElementById("comments");

let nameEdited = false;
let emailEdited = false;
let commentsEdited = false;

const formErrors = []
const formErrorsHistory = document.getElementById("form-errors-history");

function validate(inputID) {
    const input = document.getElementById(inputID);
    const error = document.getElementById(`${input.id}-error`);
    const validityState = input.validity;
    let message = "";

    input.setCustomValidity("");

    if (validityState.valueMissing) {
        message = `${input.name} is required. Please provide a value.`;
    } else if (validityState.typeMismatch) {
        message = "Email has an invalid format. Please use a valid email address such as name@example.com.";
    } else if (validityState.tooShort) {
        message = `${input.name} is too short. Please enter at least ${input.minLength} characters.`;
    }

    if (message) {
        input.setCustomValidity(message);
        error.textContent = `Error with ${input.name}: ${message}`;
        error.hidden = false;
        document.getElementById("form-errors").hidden = false;
    } else {
        error.textContent = "";
        error.hidden = true;
        const errors = document.querySelectorAll("#form-errors p:not([hidden])");
        if (errors.length === 0) {
            document.getElementById("form-errors").hidden = true;
        }
    }

    return input.validity.valid;
}

function validateAndReport(inputID) {
    const input = document.getElementById(inputID);
    const isValid = validate(inputID);

    input.reportValidity();
    return isValid;
}

function updateCommentsInformation() {
    const remaining = commentsInput.maxLength - commentsInput.value.length;
    const count = document.getElementById("comments-count");
    const warning = document.getElementById("comments-warning");
    const warningThreshold = 50;

    count.textContent = `${remaining} characters remaining (${commentsInput.maxLength} maximum).`;
    warning.textContent = "";
    count.className = "";
    warning.className = "";

    if (remaining === 0) {
        count.textContent = `0 characters remaining (${commentsInput.maxLength} maximum).`;
        warning.textContent = "Character limit reached. You cannot enter more characters.";
        count.classList.add("comments-limit");
        warning.classList.add("comments-limit");
    } else if (remaining <= warningThreshold) {
        warning.textContent = "Warning: you are approaching the character limit.";
        count.classList.add("comments-warning");
        warning.classList.add("comments-warning");
    } else if (commentsInput.value.length < commentsInput.minLength) {
        warning.textContent = `Warning: comments must contain at least ${commentsInput.minLength} characters.`;
        warning.classList.add("comments-minimum-warning");
    }
}

function recordSubmissionErrors(fields) {
    fields.forEach((field) => {
        if (!field.validity.valid) {
            formErrors.push({field: field.name, error: field.validationMessage});
        }
    });
}

nameInput.addEventListener("input", () => {
    nameEdited = true;
    if (!document.getElementById("name-error").hidden) {
        validate("name");
    }
});
nameInput.addEventListener("blur", () => {
    if (nameEdited) {
        validateAndReport("name");
    }
});

emailInput.addEventListener("input", () => {
    emailEdited = true;
    if (!document.getElementById("email-error").hidden) {
        validate("email");
    }
});
emailInput.addEventListener("blur", () => {
    if (emailEdited) {
        validateAndReport("email");
    }
});

commentsInput.addEventListener("input", () => {
    commentsEdited = true;
    updateCommentsInformation();
    document.getElementById("comments-info").hidden = false;
    if (!document.getElementById("comments-error").hidden) {
        validate("comments");
    }
});
commentsInput.addEventListener("blur", () => {
    if (commentsEdited) {
        document.getElementById("comments-info").hidden = false;
        validateAndReport("comments");
    }
});

form.addEventListener("submit", (event) => {
    nameEdited = true;
    emailEdited = true;
    commentsEdited = true;

    updateCommentsInformation();
    document.getElementById("comments-info").hidden = false;

    const fields = [nameInput, emailInput, commentsInput];

    const nameIsValid = validateAndReport("name");
    const emailIsValid = validateAndReport("email");
    const commentsAreValid = validateAndReport("comments");

    if (!nameIsValid || !emailIsValid || !commentsAreValid) {
        recordSubmissionErrors(fields);
        event.preventDefault();
        return;
    }

    formErrorsHistory.value = JSON.stringify(formErrors);
});

updateCommentsInformation();
