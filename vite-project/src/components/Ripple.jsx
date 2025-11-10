const handleRipple = (event) => {
        const ripple = document.createElement("span");
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.pointerEvents = "none";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
        ripple.style.transform = "scale(0)";
        ripple.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
        ripple.style.opacity = "1";

        const target = event.currentTarget;
        target.style.position = "relative";
        target.style.overflow = "hidden";
        target.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.style.transform = "scale(2)";
            ripple.style.opacity = "0";
        });

        setTimeout(() => ripple.remove(), 600);
    };
    export { handleRipple };
