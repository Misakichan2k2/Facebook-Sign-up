function populateDropdown(start, end, selectElement, reverse) {
  for (let i = start; reverse ? i >= end : i <= end; reverse ? i-- : i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectElement.add(option);
  }
}

function getCurrentDate() {
  const currentDate = new Date();
  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  };
}

function setSelectedOption(selectElement, value) {
  const option = selectElement.querySelector(`option[value="${value}"]`);
  if (option) {
    option.selected = true;
  }
}

populateDropdown(1, 31, document.getElementById('day_id'));

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
months.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index + 1;
  option.text = month;
  document.getElementById('month_id').add(option);
});

const currentYear = new Date().getFullYear();
populateDropdown(currentYear, 1905, document.getElementById('year_id'), true);

const currentDate = getCurrentDate();
setSelectedOption(document.getElementById('day_id'), currentDate.day);
setSelectedOption(document.getElementById('month_id'), currentDate.month);
setSelectedOption(document.getElementById('year_id'), currentDate.year);

// When gender = custom
const genderRadioButtons = document.getElementsByName('gender');
const customGenderContainer = document.getElementById('customGenderContainer');

customGenderContainer.classList.add('hidden');

genderRadioButtons.forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.value === 'custom') {
      customGenderContainer.classList.remove('hidden');
    } else {
      customGenderContainer.classList.add('hidden');
    }
  });
});

// Validate
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  resetForm();

  validateInput("firstname_id", "What's your name?");
  validateInput("surname_id", "What's your name?");
  validateMobileOrEmail();
  validatePassword();
  validateDateOfBirth();
  validateGender();

  if (isCustomGenderSelected() && !customGenderIsValid()) {
    return;
  }

  document.getElementById("form").submit();
});

function validateInput(inputId, errorMessage) {
  const inputElement = document.getElementById(inputId);
  if (isEmpty(inputElement)) {
    displayError(inputElement, errorMessage);
  }
}

function validateMobileOrEmail() {
  const mobileOrEmailInput = document.getElementById("mobile_or_email_id");
  const inputValue = mobileOrEmailInput.value.trim();
  const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const phoneNumberFormat = /^\d+$/;

  if (inputValue === "" || !(emailFormat.test(inputValue) || phoneNumberFormat.test(inputValue))) {
    displayError(mobileOrEmailInput, 'Mobile number or email address is required or invalid.');
  }
}

function validatePassword() {
  const passwordInput = document.getElementById("new_password_id");
  const inputValue = passwordInput.value.trim();
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}$/;

  if (inputValue === "") {
    displayError(passwordInput, 'Enter a combination of at least six numbers, letters and punctuation marks (such as ! and &).');
  }
}

function validateDateOfBirth() {
  const dayInput = document.getElementById("day_id");
  const monthInput = document.getElementById("month_id");
  const yearInput = document.getElementById("year_id");

  const currentDate = getCurrentDate();
  const userDate = {
    day: parseInt(dayInput.value),
    month: parseInt(monthInput.value),
    year: parseInt(yearInput.value),
  };

  const ageLimit = 13;
  const minBirthYear = currentDate.year - ageLimit;

  const selectedDate = new Date(userDate.year, userDate.month - 1, userDate.day);
  const minDate = new Date(currentDate.year - 13, currentDate.month - 1, currentDate.day);

  if (selectedDate > minDate) {
    displayError(dayInput, "Invalid date of birth.");
    displayError(monthInput, "");
    displayError(yearInput, "");
  } else if (
    userDate.year > currentDate.year ||
    (userDate.year === currentDate.year && userDate.month > currentDate.month) ||
    (userDate.year === currentDate.year && userDate.month === currentDate.month && userDate.day > currentDate.day)
  ) {
    displayError(dayInput, "Please enter a valid date of birth.");
    displayError(monthInput, "");
    displayError(yearInput, "");
  } else {
    resetError(dayInput);
    resetError(monthInput);
    resetError(yearInput);
  }
}

function validateGender() {
  const genderRadioButtons = document.getElementsByName("gender");
  const isSelected = Array.from(genderRadioButtons).some(radio => radio.checked);

  const genderErrorLabel = document.querySelector('.gender-radio .error-message');
  if (genderErrorLabel) {
    genderErrorLabel.remove();
  }

  Array.from(genderRadioButtons).forEach(radio => {
    radio.style.border = '1px solid #ccd0d5';
  });

  if (!isSelected) {
    Array.from(genderRadioButtons).forEach(radio => {
      radio.style.border = '1px solid red';
    });

    const genderErrorLabel = document.createElement('div');
    genderErrorLabel.className = 'error-message';
    genderErrorLabel.textContent = 'Please choose a gender. You can change who can see this later.';
    document.querySelector('.gender-radio').appendChild(genderErrorLabel);
  } else {
    if (isCustomGenderSelected()) {
      const pronounSelect = document.querySelector('#customGenderContainer [aria-label="Select your pronoun"]');
      if (!pronounSelect.value || pronounSelect.value === "Select your pronoun") {
        displayError(pronounSelect, "Please select your pronoun.");
      }
    }
  }
}

function resetError(inputElement) {
  inputElement.style.border = '1px solid #ccd0d5';

  const errorLabel = inputElement.parentNode.querySelector('.error-message');
  if (errorLabel) {
    errorLabel.remove();
  }
}

function resetForm() {
  const inputElements = document.querySelectorAll('.input-text-custom');
  inputElements.forEach(input => {
    input.style.border = '1px solid #ccd0d5';

    const errorLabel = input.parentNode.querySelector('.error-message');
    if (errorLabel) {
      errorLabel.remove();
    }
  });

  const sexRadioButtons = document.getElementsByName('gender');
  Array.from(sexRadioButtons).forEach(radio => {
    radio.classList.remove("border-red");
  });

  const pronounSelect = document.querySelector('#customGenderContainer [aria-label="Select your pronoun"]');
  if (pronounSelect) {
    pronounSelect.style.border = '1px solid #ccd0d5';
    const errorLabel = pronounSelect.parentNode.querySelector('.error-message');
    if (errorLabel) {
      errorLabel.remove();
    }
  }
}

function displayError(inputElement, errorMessage) {
  inputElement.style.border = '1px solid red';

  const errorLabel = document.createElement('div');
  errorLabel.className = 'error-message';
  errorLabel.textContent = errorMessage;

  inputElement.parentNode.appendChild(errorLabel);
}

function isEmpty(inputElement) {
  return inputElement.value.trim() === '';
}

function isCustomGenderSelected() {
  const customGenderRadio = document.getElementById('custom');
  return customGenderRadio.checked;
}

function customGenderIsValid() {
  const customGenderInput = document.querySelector('#customGenderContainer [name="custom-gender-optional"]');
  return isEmpty(customGenderInput);
}