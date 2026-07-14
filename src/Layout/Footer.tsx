const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-bg mt-auto">
      <div className="container-custom py-6 text-sm text-text-muted">
        © {new Date().getFullYear()} Company Name
      </div>
    </footer>
  );
};

export default Footer;
