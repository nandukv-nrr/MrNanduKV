import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { GithubIcon, LinkedinIcon, Magnetic, Split } from '../components/primitives'
import { profile } from '../data/profile'

/**
 * GitHub Pages has no backend, so the form composes an email in the visitor's
 * own mail app (mailto:). To use a form service instead (e.g. Formspree),
 * replace the body of `onSubmit` with a fetch() to your endpoint.
 */
function ContactForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState(false)
  const [opened, setOpened] = useState(false)
  const invalid = touched && message.trim().length === 0

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!message.trim()) return
    const subject = name.trim() ? `Portfolio enquiry from ${name.trim()}` : 'Portfolio enquiry'
    const body = name.trim() ? `${message.trim()}\n\n— ${name.trim()}` : message.trim()
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate data-reveal="fade">
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          value={message}
          aria-invalid={invalid}
          aria-describedby={invalid ? 'cf-error' : 'cf-hint'}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        {invalid && (
          <p id="cf-error" className="field__error" role="alert">
            Add a short message so the email has something to say.
          </p>
        )}
      </div>
      <div className="form__foot">
        <button type="submit" className="btn btn--primary">
          Open email draft <ArrowUpRight aria-hidden="true" />
        </button>
        <p id="cf-hint" className="form__hint" aria-live="polite">
          {opened
            ? `Your email app should now be open. If nothing happened, write to ${profile.email}.`
            : 'Opens your email app with the message filled in — nothing is sent from this page.'}
        </p>
      </div>
    </form>
  )
}

export function Contact() {
  const socials = profile.socials.filter((s) => s.url)
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-head__bar mono">
          <span className="section-head__index">06</span>
          <span>Contact</span>
          <span className="rule" data-reveal="line" aria-hidden="true" />
        </div>

        <h2 className="contact__title" id="contact-title" data-reveal="split">
          <Split text="Let’s build something" /> <span className="serif accent"><Split text="clear." offset={3} /></span>
        </h2>

        <div className="contact__mail" data-reveal="fade">
          <Magnetic strength={0.12}>
            <a href={`mailto:${profile.email}`} className="contact__email" data-cursor="Email">
              {profile.email}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Magnetic>
        </div>

        <div className="contact__grid">
          <ul className="contact__details">
            <li data-reveal="fade">
              <Mail aria-hidden="true" />
              <div>
                <span className="mono">Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </li>
            <li data-reveal="fade">
              <Phone aria-hidden="true" />
              <div>
                <span className="mono">Phone</span>
                <a href={profile.phoneHref}>{profile.phone}</a>
              </div>
            </li>
            <li data-reveal="fade">
              <MapPin aria-hidden="true" />
              <div>
                <span className="mono">Based in</span>
                <span>{profile.location}</span>
              </div>
            </li>
            {socials.map((social) => (
              <li key={social.label} data-reveal="fade">
                {social.kind === 'github' ? <GithubIcon /> : <LinkedinIcon />}
                <div>
                  <span className="mono">{social.label}</span>
                  <a href={social.url} target="_blank" rel="noreferrer noopener">
                    {social.url.replace(/^https?:\/\/(www\.)?/, '')}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
