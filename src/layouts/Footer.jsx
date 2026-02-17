export default function Footer() {
  return (
    <footer className="w-full mt-6 bg-[#3C498B] text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Left line */}
          <hr className="hidden sm:block flex-1 border-[#3C498B]" />

          {/* Text */}
          <p className="text-xs sm:text-sm text-center whitespace-nowrap">
            © 2026 AWS. All rights reserved.
          </p>

          {/* Right line */}
          <hr className="hidden sm:block flex-1 border-[#3C498B]" />

        </div>
      </div>
    </footer>
  );
}
