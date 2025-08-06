export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-6 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} MyPortal. All rights reserved.</p>
      <p>
        <a href="/terms" className="hover:underline">Terms</a> · 
        <a href="/privacy" className="hover:underline">Privacy</a>
      </p>
    </footer>
  );
}
