(() => {
  const cvLinks = [...document.querySelectorAll('[data-cv-download]')];

  const downloadCv = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('assets/cv/Mark-Jhollan-Bricia-CV.base64.txt', { cache: 'no-store' });
      if (!response.ok) throw new Error('CV asset unavailable');

      const base64 = (await response.text()).trim();
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Mark-Jhollan-Bricia-Master-ATS-CV-v5.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1200);
    } catch (_) {
      window.open('Mark-Jhollan-Bricia-CV.pdf', '_blank', 'noopener');
    }
  };

  cvLinks.forEach((link) => link.addEventListener('click', downloadCv));
})();
