"use client"

import { useState, type FormEvent } from "react"
import { offer } from "@/lib/data/site"

export default function ConnectForm() {
  const [previewed, setPreviewed] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPreviewed(true)
  }
  return (
    <form className="intake" onSubmit={submit} onChange={() => setPreviewed(false)}>
      <div className="intake__head">
        <p className="label">Business profile</p>
        <h2 className="display" id="intake-title">Submit Your Business Profile</h2>
        <p>To get started with us, please tell us about your business and what type of help you need.</p>
      </div>
      <fieldset>
        <legend className="voice">Your contact information</legend>
        <div className="intake__grid">
          <label>First name <span aria-hidden="true">*</span><input name="firstName" autoComplete="given-name" required /></label>
          <label>Last name <span aria-hidden="true">*</span><input name="lastName" autoComplete="family-name" required /></label>
          <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required /></label>
          <label>Phone number <span aria-hidden="true">*</span><input name="phone" type="tel" autoComplete="tel" required /></label>
        </div>
      </fieldset>
      <fieldset>
        <legend className="voice">About your business</legend>
        <div className="intake__grid">
          <label>Business name <span aria-hidden="true">*</span><input name="businessName" autoComplete="organization" required /></label>
          <label>Business website<input name="website" type="url" placeholder="https://" /></label>
          <label>Business address<input name="address" autoComplete="street-address" /></label>
          <label>Borough <span aria-hidden="true">*</span><select name="borough" required defaultValue=""><option value="" disabled>Select a borough</option><option value="Bronx">Bronx</option><option value="Brooklyn">Brooklyn</option><option value="Manhattan">Manhattan</option><option value="Queens">Queens</option><option value="Staten Island">Staten Island</option></select></label>
          <label className="intake__wide">Tell us about your business<textarea name="description" rows={4} /></label>
        </div>
      </fieldset>
      <fieldset>
        <legend className="voice">How can we help?</legend>
        <p className="intake__hint">Select any areas where you would like guidance.</p>
        <div className="intake__checks">{offer.services.map((service) => <label key={service.id}><input type="checkbox" name="needs" value={service.id} /><span>{service.name}</span></label>)}</div>
        <label className="intake__wide">Anything else we should know?<textarea name="otherNeeds" rows={4} /></label>
      </fieldset>
      <div className="intake__end"><p>Fields marked * are required.</p><button type="submit" className="btn btn--coral">Review profile</button></div>
      {previewed ? <p role="status" className="intake__status">Your profile is ready for review. This preview is not connected to a submission service, so no information was sent. For live assistance, use the current intake form linked below or contact your borough Chamber.</p> : null}
    </form>
  )
}
