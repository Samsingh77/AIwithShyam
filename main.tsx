@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&family=Outfit:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --color-brand-black: #050505;
  --color-brand-gray: #1a1a1a;
  --color-brand-accent: #10b981; /* Emerald 500 */
  --color-brand-green: #10b981;
  --color-brand-lime: #84cc16;
}

@layer base {
  body {
    @apply bg-brand-black text-white antialiased selection:bg-brand-accent selection:text-brand-black font-sans;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .cinematic-grain {
    position: fixed;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    width: 200%;
    height: 200%;
    background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
    background-repeat: repeat;
    animation: grain 8s steps(10) infinite;
    visibility: visible;
    opacity: 0.05;
    pointer-events: none;
    z-index: 50;
  }

  @keyframes grain {
    0%, 100% { transform:translate(0, 0) }
    10% { transform:translate(-5%, -10%) }
    20% { transform:translate(-15%, 5%) }
    30% { transform:translate(7%, -25%) }
    40% { transform:translate(-5%, 25%) }
    50% { transform:translate(-15%, 10%) }
    60% { transform:translate(15%, 0%) }
    70% { transform:translate(0%, 15%) }
    80% { transform:translate(3%, 35%) }
    90% { transform:translate(-10%, 10%) }
  }
}
