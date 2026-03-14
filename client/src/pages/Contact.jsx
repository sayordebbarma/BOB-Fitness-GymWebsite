import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".contact-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    // Simulate sending — wire up to email service like EmailJS or Nodemailer later
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", message: "" });
    setSending(false);
  };

  const contactInfo = [
    {
      label: "Address",
      value: "123 Fitness Street, Sector 5\nNew Delhi, India 110001",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"
          />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "+91 98765 43210",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"
          />
        </svg>
      ),
    },
    {
      label: "Email",
      value: "hello@bobfitness.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      ),
    },
    {
      label: "Hours",
      value: "Mon–Sat: 5:00 AM – 11:00 PM\nSunday: 7:00 AM – 9:00 PM",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="bg-dark min-h-screen">
      {/* Header */}
      <div className="contact-header bg-surface border-border border-b px-8 pt-32 pb-12 lg:px-24">
        <div className="container-wide">
          <p className="section-label">Get In Touch</p>
          <h1 className="font-display text-5xl leading-none text-white lg:text-7xl">
            CONTACT
            <br />
            <span className="text-gray-600">US.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400">
            Have a question about membership, facilities, or anything else?
            We're here to help. Reach out and we'll get back to you within 24
            hours.
          </p>
        </div>
      </div>

      {/* Contact grid */}
      <div className="contact-grid section-padding">
        <div className="container-wide grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-px">
              {contactInfo.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="contact-item bg-dark flex flex-col gap-3 p-2"
                >
                  <div className="bg-primary/10 border-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center border">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-white">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="contact-item relative w-full overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <div className="border-primary absolute top-0 left-0 z-10 h-6 w-6 border-t-2 border-l-2" />
              <div className="border-primary absolute top-0 right-0 z-10 h-6 w-6 border-t-2 border-r-2" />
              <div className="border-primary absolute bottom-0 left-0 z-10 h-6 w-6 border-b-2 border-l-2" />
              <div className="border-primary absolute right-0 bottom-0 z-10 h-6 w-6 border-r-2 border-b-2" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.4626504756757!2d91.2787448!3d23.8376998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f5ae9be4c793%3A0x30bce3e97952686a!2sBOB%20Fitness!5e0!3m2!1sen!2sin!4v1773505300958!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  filter: "grayscale(100%) invert(90%) contrast(90%)",
                  pointerEvents: "none",
                }}
                allowFullScreen
                loading="lazy"
                title="Bob Fitness Location"
              />
            </div>
          </div>

          {/* Right — contact form */}
          <div className="contact-item">
            <div className="bg-surface border-border border p-8">
              <p className="font-display mb-1 text-xs tracking-widest text-gray-500 uppercase">
                Send A Message
              </p>
              <h2 className="font-display mb-8 text-3xl tracking-wider text-white">
                WE'D LOVE TO
                <br />
                HEAR FROM YOU.
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-dark border-border focus:border-primary w-full border px-4 py-3 text-sm text-white transition-colors outline-none placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-dark border-border focus:border-primary w-full border px-4 py-3 text-sm text-white transition-colors outline-none placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="bg-dark border-border focus:border-primary w-full border px-4 py-3 text-sm text-white transition-colors outline-none placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    className="bg-dark border-border focus:border-primary w-full resize-none border px-4 py-3 text-sm text-white transition-colors outline-none placeholder:text-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="bg-primary text-dark font-display mt-2 py-4 text-sm tracking-widest transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
