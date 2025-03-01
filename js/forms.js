// https://formspree.io/formbutton/docs/#form-field-styles

// function to dynamically load an external script
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.async = true;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`failed to load script: ${src}`));
        document.head.append(script);
    });
};


(async () => {
    // load the formbutton script from formspree
    await loadScript('https://formspree.io/js/formbutton-v1.min.js');
    await loadScript('https://kit.fontawesome.com/728e740903.js');

    // include the line verbatim
    window.formbutton = window.formbutton || function () { (formbutton.q = formbutton.q || []).push(arguments); };

    // customize formbutton
    formbutton("create", {
        action: "mailpocket.ion606.com", //"https://formspree.io/f/mgvoyqov",
        title: "Join our mailing list!",
        closeButton: {
            display: "none"
        },
        buttonImg: "<i class='fa-solid fa-star' style='font-size:24px'></i>",
        fields: [
            {
                type: "email",
                label: "Email:",
                name: "email",
                required: true,
                placeholder: "your@email.com"
            },
            {
                type: "submit",
                label: "Submit!",
                value: "Submit!"
            }
        ],
        styles: {
            body: {
                background: "linear-gradient(to bottom, #a8e063, #56ab2f)"
            },
            title: {
                background: "linear-gradient(to bottom,rgb(124, 238, 71), #a8e063)",
                color: "#333333",
                padding: "10px",
                fontSize: "20px",
                textAlign: "center"
            },
            button: {
                background: "gold",
                color: "blue"
            },
            input: {
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                margin: "10px 0",
                fontSize: "16px",
                color: "#333333"
            },
            closeButton: {
                display: "none"
            }
        },
        onResponse: (ok, setStatus) => {
            if (ok) setStatus("<span style='background-color:green; color:white; width:100%; height:100%; text-align:center; justify-content:center'>Recieved!</span>");
            else setStatus("<span style='color:red'>There was a problem. We've been notified.</span>");
        }
    })
})();
