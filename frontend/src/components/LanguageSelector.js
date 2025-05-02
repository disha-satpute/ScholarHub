import React, { useEffect } from "react";
import "../styles/LanguageSelector.css";

const LanguageSelector = () => {
    useEffect(() => {
        const initializeGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,hi,mr",
                        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                    },
                    "google_translate_element"
                );
            }
        };

        const addGoogleTranslateScript = () => {
            const script = document.createElement("script");
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            script.id = "google-translate-script";
            document.body.appendChild(script);
        };

        // Define the global init function BEFORE loading the script
        window.googleTranslateElementInit = initializeGoogleTranslate;

        if (!document.getElementById("google-translate-script")) {
            addGoogleTranslateScript();
        } else {
            // Script already loaded: delay to ensure google.translate exists
            setTimeout(() => {
                initializeGoogleTranslate();
            }, 1000);
        }
    }, []);

    return <div id="google_translate_element" className="language-selector"></div>;
};

export default LanguageSelector;
