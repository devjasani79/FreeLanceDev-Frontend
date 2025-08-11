// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      © {new Date().getFullYear()} FreelanceDev. All rights reserved.
    </footer>
  );
}
