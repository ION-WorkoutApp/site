// email handler module

const form = document.querySelector('#email-form'),
    emailInput = document.querySelector('.email-input'),
    popup = document.querySelector('#popup'),
    popupClose = document.querySelector('#popup-close');

if (localStorage.getItem('email-aquired')) form.style.display = 'none';

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (localStorage.getItem('email-aquired')) return;

    const email = emailInput.value;
    if (!email?.length) return

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });
        if (response.ok) {
            // email submitted successfully; reset form and show popup
            form.reset();
            localStorage.setItem('email-squired', true)
            showPopup();
        } else {
            showPopup(true);
            console.log(await response.text());
            console.error('submission error');
        }
    } catch (error) {
        // handle network errors
        console.error('network error', error);
    }
});

const showPopup = (isError) => {
    if (isError) popup.classList.add('error');
    
    popup.classList.remove('hidden');
    // add a class to fade in the popup
    popup.classList.add('show');

    // automatically hide popup after 3 seconds
    setTimeout(() => {
        hidePopup();
    }, 3000);
};

const hidePopup = () => {
    popup.classList.remove('show');
    // delay hiding the element until the transition ends
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 300);
};

// allow user to close popup manually
popupClose.addEventListener('click', hidePopup);
