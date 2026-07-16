---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 5
---

<style>
    .post > .post-header {
        display: none;
    }

    .cv-controls {
        align-items: center;
        display: flex;
        font-size: 0.85rem;
        gap: 0.45rem;
        justify-content: flex-end;
        margin-bottom: 0.6rem;
    }

    .cv-version-label {
        color: var(--global-text-color-light);
        transition: color 0.2s ease;
    }

    .cv-version-label.active {
        color: var(--global-theme-color);
        font-weight: 600;
    }

    .cv-switch {
        display: inline-block;
        height: 1.25rem;
        margin: 0;
        position: relative;
        width: 2.25rem;
    }

    .cv-switch input {
        height: 0;
        opacity: 0;
        width: 0;
    }

    .cv-slider {
        background: var(--global-divider-color);
        border-radius: 1rem;
        cursor: pointer;
        inset: 0;
        position: absolute;
        transition: background 0.2s ease;
    }

    .cv-slider::before {
        background: white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgb(0 0 0 / 25%);
        content: "";
        height: 0.95rem;
        left: 0.15rem;
        position: absolute;
        top: 0.15rem;
        transition: transform 0.2s ease;
        width: 0.95rem;
    }

    .cv-switch input:checked + .cv-slider {
        background: var(--global-theme-color);
    }

    .cv-switch input:checked + .cv-slider::before {
        transform: translateX(1rem);
    }

    .cv-switch input:focus-visible + .cv-slider {
        outline: 2px solid var(--global-theme-color);
        outline-offset: 2px;
    }
</style>

<div class="cv-controls">
    <span id="short-cv-label" class="cv-version-label active">Short</span>
    <label class="cv-switch">
        <input id="cv-version-toggle" type="checkbox" role="switch" aria-label="Show full CV">
        <span class="cv-slider" aria-hidden="true"></span>
    </label>
    <span id="full-cv-label" class="cv-version-label">Full</span>
</div>

<iframe id="cv-frame" title="Emanuele Rossi CV" src="{{ '/assets/pdf/emanuele_rossi_cv.pdf' | relative_url }}?v=20260716-links" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">
This browser does not support PDFs. Please download the PDF to view it:
<a href="{{ '/assets/pdf/emanuele_rossi_cv.pdf' | relative_url }}?v=20260716-links">Download PDF</a>
</iframe>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const versions = {
            short: "{{ '/assets/pdf/emanuele_rossi_cv.pdf' | relative_url }}?v=20260716-links",
            full: "{{ '/assets/pdf/emanuele_rossi_cv_full.pdf' | relative_url }}?v=20260716-links",
        };
        const frame = document.getElementById("cv-frame");
        const toggle = document.getElementById("cv-version-toggle");
        const shortLabel = document.getElementById("short-cv-label");
        const fullLabel = document.getElementById("full-cv-label");

        function showVersion(version, updateUrl) {
            if (frame.getAttribute("src") !== versions[version]) {
                frame.src = versions[version];
            }
            toggle.checked = version === "full";
            shortLabel.classList.toggle("active", version === "short");
            fullLabel.classList.toggle("active", version === "full");

            if (updateUrl) {
                const url = new URL(window.location.href);
                if (version === "full") {
                    url.searchParams.set("version", "full");
                } else {
                    url.searchParams.delete("version");
                }
                window.history.replaceState({}, "", url);
            }
        }

        toggle.addEventListener("change", function () {
            showVersion(toggle.checked ? "full" : "short", true);
        });

        const initialVersion = new URLSearchParams(window.location.search).get("version") === "full" ? "full" : "short";
        showVersion(initialVersion, false);
    });
</script>
