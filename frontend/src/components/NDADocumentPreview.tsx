'use client';

import React from 'react';
import { NDAData } from '../types/nda';
import { Eye, Highlighter, Check, Sparkles, FileText } from 'lucide-react';

interface NDADocumentPreviewProps {
  data: NDAData;
  documentRef: React.RefObject<HTMLDivElement | null>;
}

export const NDADocumentPreview: React.FC<NDADocumentPreviewProps> = ({ data, documentRef }) => {
  const [viewMode, setViewMode] = React.useState<'both' | 'cover' | 'terms'>('both');
  const [highlightVars, setHighlightVars] = React.useState<boolean>(data.highlightVariables ?? true);

  // Helper to conditionally wrap dynamic values with highlight styling
  const val = (text: string | number, fallback = '—') => {
    const stringVal = text !== undefined && text !== null && String(text).trim() !== '' ? String(text) : fallback;
    if (!highlightVars) {
      return <span>{stringVal}</span>;
    }
    return (
      <mark className="bg-amber-100 text-amber-950 font-semibold px-1 rounded border border-amber-300 transition-all">
        {stringVal}
      </mark>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 backdrop-blur-md print:hidden">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'both'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Agreement
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cover')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'cover'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cover Page
          </button>
          <button
            type="button"
            onClick={() => setViewMode('terms')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'terms'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Standard Terms
          </button>
        </div>

        {/* Highlight Variables Switch */}
        <button
          type="button"
          onClick={() => setHighlightVars(!highlightVars)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            highlightVars
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{highlightVars ? 'Variables Highlighted' : 'Highlight Inputs'}</span>
        </button>
      </div>

      {/* Main Rendered Legal Document Container */}
      <div
        ref={documentRef}
        id="nda-document-canvas"
        className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-slate-200 font-serif leading-relaxed text-sm max-w-4xl mx-auto print:shadow-none print:p-0 print:border-none print:rounded-none"
      >
        {/* Legal Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 font-sans text-xs text-amber-900 flex items-start gap-2.5">
          <span className="font-bold text-amber-800 uppercase tracking-wider shrink-0 bg-amber-200/60 px-1.5 py-0.5 rounded text-[10px]">
            Legal Disclaimer
          </span>
          <p className="leading-snug text-[11px]">
            This document is a draft generated for evaluation purposes only and is subject to final review and customization by a qualified legal professional prior to execution.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* COVER PAGE */}
        {/* ========================================================================= */}
        {(viewMode === 'both' || viewMode === 'cover') && (
          <div className="space-y-6 pb-10 border-b border-slate-300 print:pb-6">
            {/* Document Header Title */}
            <div className="text-center space-y-1">
              <h1 className="font-sans text-2xl font-bold text-slate-900 tracking-tight">
                Mutual Non-Disclosure Agreement
              </h1>
              <p className="font-sans text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Cover Page
              </p>
            </div>

            {/* Introductory Notice */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-sans text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">USING THIS MUTUAL NON-DISCLOSURE AGREEMENT</p>
              <p>
                This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{' '}
                <a href="https://commonpaper.com/standards/mutual-nda/1.0" className="text-indigo-600 underline font-medium" target="_blank" rel="noreferrer">
                  commonpaper.com/standards/mutual-nda/1.0
                </a>. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.
              </p>
            </div>

            {/* Key Terms Summary List */}
            <div className="font-sans space-y-4 text-xs text-slate-800">
              {/* Purpose */}
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Purpose</h3>
                <p className="text-slate-500 italic">How Confidential Information may be used</p>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-900">
                  {val(data.purpose)}
                </div>
              </div>

              {/* Effective Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Effective Date</h3>
                  <p className="mt-1 text-slate-900">{val(data.effectiveDate)}</p>
                </div>
              </div>

              {/* MNDA Term */}
              <div className="space-y-1 pt-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">MNDA Term</h3>
                <p className="text-slate-500 italic">The length of this MNDA</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{data.mndaTermType === 'expires_years' ? '[x]' : '[ ]'}</span>
                    <span>
                      Expires {val(data.mndaTermYears)} year(s) from Effective Date.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{data.mndaTermType === 'until_terminated' ? '[x]' : '[ ]'}</span>
                    <span>Continues until terminated in accordance with the terms of the MNDA.</span>
                  </div>
                </div>
              </div>

              {/* Term of Confidentiality */}
              <div className="space-y-1 pt-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Term of Confidentiality</h3>
                <p className="text-slate-500 italic">How long Confidential Information is protected</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{data.confidentialityTermType === 'years' ? '[x]' : '[ ]'}</span>
                    <span>
                      {val(data.confidentialityTermYears)} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{data.confidentialityTermType === 'perpetuity' ? '[x]' : '[ ]'}</span>
                    <span>In perpetuity.</span>
                  </div>
                </div>
              </div>

              {/* Governing Law & Jurisdiction */}
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Governing Law & Jurisdiction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                  <div>
                    <span className="font-semibold">Governing Law: </span>
                    {val(data.governingLawState)}
                  </div>
                  <div>
                    <span className="font-semibold">Jurisdiction: </span>
                    {val(data.jurisdiction)}
                  </div>
                </div>
              </div>

              {/* MNDA Modifications */}
              <div className="space-y-1 pt-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">MNDA Modifications</h3>
                <p className="text-slate-500 italic">List any modifications to the MNDA</p>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  {val(data.modifications)}
                </div>
              </div>
            </div>

            {/* Signature Table */}
            <div className="font-sans space-y-3 pt-4">
              <p className="text-xs text-slate-700 font-medium">
                By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold">
                      <th className="border border-slate-300 p-2 text-left w-1/4">FIELD</th>
                      <th className="border border-slate-300 p-2 text-left w-3/8">PARTY 1</th>
                      <th className="border border-slate-300 p-2 text-left w-3/8">PARTY 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Signature</td>
                      <td className="border border-slate-300 p-4 font-serif text-slate-400 italic">
                        [Sign Here]
                      </td>
                      <td className="border border-slate-300 p-4 font-serif text-slate-400 italic">
                        [Sign Here]
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Print Name</td>
                      <td className="border border-slate-300 p-2">{val(data.party1.signatoryName)}</td>
                      <td className="border border-slate-300 p-2">{val(data.party2.signatoryName)}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Title</td>
                      <td className="border border-slate-300 p-2">{val(data.party1.signatoryTitle)}</td>
                      <td className="border border-slate-300 p-2">{val(data.party2.signatoryTitle)}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Company</td>
                      <td className="border border-slate-300 p-2">
                        {val(data.party1.companyName)} ({val(data.party1.entityType)})
                      </td>
                      <td className="border border-slate-300 p-2">
                        {val(data.party2.companyName)} ({val(data.party2.entityType)})
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">
                        Notice Address <br />
                        <span className="font-normal text-[10px] text-slate-500">Email / Postal</span>
                      </td>
                      <td className="border border-slate-300 p-2 space-y-1">
                        <div>{val(data.party1.address)}</div>
                        <div className="text-slate-600 font-mono text-[11px]">{val(data.party1.email)}</div>
                      </td>
                      <td className="border border-slate-300 p-2 space-y-1">
                        <div>{val(data.party2.address)}</div>
                        <div className="text-slate-600 font-mono text-[11px]">{val(data.party2.email)}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Date</td>
                      <td className="border border-slate-300 p-2">{val(data.effectiveDate)}</td>
                      <td className="border border-slate-300 p-2">{val(data.effectiveDate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="font-sans text-[11px] text-slate-400 text-center pt-2">
              Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STANDARD TERMS */}
        {/* ========================================================================= */}
        {(viewMode === 'both' || viewMode === 'terms') && (
          <div className={`space-y-5 ${viewMode === 'both' ? 'pt-8' : ''}`}>
            <div className="text-center space-y-1">
              <h2 className="font-sans text-xl font-bold text-slate-900 tracking-tight">
                Standard Terms (Version 1.0)
              </h2>
              <p className="font-sans text-xs text-slate-500">
                Common Paper Mutual Non-Disclosure Agreement
              </p>
            </div>

            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                <strong>1. Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in connection with the <em>Purpose ({val(data.purpose)})</em> which (1) the Disclosing Party identifies to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure (&ldquo;<strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also includes the existence and status of the parties&rsquo; discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.
              </p>

              <p>
                <strong>2. Use and Protection of Confidential Information.</strong> The Receiving Party shall: (a) use Confidential Information solely for the <em>Purpose</em>; (b) not disclose Confidential Information to third parties without the Disclosing Party&rsquo;s prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the <em>Purpose</em>, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.
              </p>

              <p>
                <strong>3. Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.
              </p>

              <p>
                <strong>4. Disclosures Required by Law.</strong> The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to obtain confidential treatment for the Confidential Information.
              </p>

              <p>
                <strong>5. Term and Termination.</strong> This MNDA commences on the <em>Effective Date ({val(data.effectiveDate)})</em> and expires at the end of the <em>MNDA Term ({data.mndaTermType === 'expires_years' ? `${data.mndaTermYears} Year(s)` : 'Continues until terminated'})</em>. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party&rsquo;s obligations relating to Confidential Information will survive for the <em>Term of Confidentiality ({data.confidentialityTermType === 'years' ? `${data.confidentialityTermYears} Year(s)` : 'In perpetuity'})</em>, despite any expiration or termination of this MNDA.
              </p>

              <p>
                <strong>6. Return or Destruction of Confidential Information.</strong> Upon expiration or termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party&rsquo;s written request, destroy all Confidential Information in the Receiving Party&rsquo;s possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.
              </p>

              <p>
                <strong>7. Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.
              </p>

              <p>
                <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>

              <p>
                <strong>9. Governing Law and Jurisdiction.</strong> This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of <em>Governing Law ({val(data.governingLawState)})</em>, without regard to the conflict of laws provisions of such <em>Governing Law</em>. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in <em>Jurisdiction ({val(data.jurisdiction)})</em>. Each party irrevocably submits to the exclusive jurisdiction of such <em>Jurisdiction</em> in any such suit, action, or proceeding.
              </p>

              <p>
                <strong>10. Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.
              </p>

              <p>
                <strong>11. General.</strong> Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must be signed by the waiving party&rsquo;s authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.
              </p>
            </div>

            <div className="font-sans text-[11px] text-slate-400 text-center pt-6 border-t border-slate-200">
              Common Paper Mutual Non-Disclosure Agreement Version 1.0 free to use under CC BY 4.0.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
