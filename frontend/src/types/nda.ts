export interface NDAParty {
  companyName: string;
  entityType: string;
  address: string;
  email: string;
  signatoryName: string;
  signatoryTitle: string;
}

export interface NDAData {
  party1: NDAParty;
  party2: NDAParty;
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'expires_years' | 'until_terminated';
  mndaTermYears: number;
  confidentialityTermType: 'years' | 'perpetuity';
  confidentialityTermYears: number;
  governingLawState: string;
  jurisdiction: string;
  modifications: string;
  includeCoverPage: boolean;
  highlightVariables: boolean;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  data: Partial<NDAData>;
}

export const SAMPLE_PRESETS: PresetScenario[] = [
  {
    id: 'saas-partnership',
    name: 'SaaS Integration Partnership',
    description: 'Standard NDA between two tech companies evaluating API integration and co-marketing.',
    data: {
      party1: {
        companyName: 'Acme SaaS Solutions Inc.',
        entityType: 'Delaware Corporation',
        address: '100 Tech Blvd, Suite 500, San Francisco, CA 94107',
        email: 'legal@acmesaas.com',
        signatoryName: 'Jane Doe',
        signatoryTitle: 'Chief Executive Officer',
      },
      party2: {
        companyName: 'Global Cloud Systems LLC',
        entityType: 'California LLC',
        address: '250 Enterprise Way, Austin, TX 78701',
        email: 'notices@globalcloud.io',
        signatoryName: 'Robert Smith',
        signatoryTitle: 'VP of Product Partnerships',
      },
      purpose: 'Evaluating whether to enter into a technical integration partnership, joint product API connection, and mutual co-marketing initiative.',
      effectiveDate: new Date().toISOString().split('T')[0],
      mndaTermType: 'expires_years',
      mndaTermYears: 1,
      confidentialityTermType: 'years',
      confidentialityTermYears: 2,
      governingLawState: 'Delaware',
      jurisdiction: 'federal or state courts located in Wilmington, DE',
      modifications: 'None.',
    },
  },
  {
    id: 'investor-due-diligence',
    name: 'Venture Capital / Investment',
    description: 'Mutual confidentiality agreement for sharing financial and tech metrics with investors.',
    data: {
      party1: {
        companyName: 'NextGen AI Technologies Inc.',
        entityType: 'Delaware Corporation',
        address: '75 Founders Square, Boston, MA 02110',
        email: 'founders@nextgenai.co',
        signatoryName: 'Alex Rivera',
        signatoryTitle: 'Co-Founder & CEO',
      },
      party2: {
        companyName: 'Horizon Capital Partners Fund II LP',
        entityType: 'Delaware Limited Partnership',
        address: '500 Sand Hill Road, Suite 200, Menlo Park, CA 94025',
        email: 'deals@horizoncap.com',
        signatoryName: 'Elena Rostova',
        signatoryTitle: 'Managing Partner',
      },
      purpose: 'Evaluating a potential Series A equity investment, reviewing financial records, proprietary algorithms, and cap table data.',
      effectiveDate: new Date().toISOString().split('T')[0],
      mndaTermType: 'expires_years',
      mndaTermYears: 2,
      confidentialityTermType: 'years',
      confidentialityTermYears: 3,
      governingLawState: 'New York',
      jurisdiction: 'courts located in New York County, NY',
      modifications: 'Section 2 is modified to clarify that Receiving Party may share info with limited partners bound by customary LP confidentiality.',
    },
  },
  {
    id: 'vendor-contractor',
    name: 'Vendor & Consultant Evaluation',
    description: 'Protects proprietary code base and customer data when hiring specialist consultants.',
    data: {
      party1: {
        companyName: 'Fintech Secure Corp',
        entityType: 'Delaware Corporation',
        address: '40 Wall Street, 28th Floor, New York, NY 10005',
        email: 'compliance@fintechsecure.com',
        signatoryName: 'Michael Chang',
        signatoryTitle: 'Chief Information Security Officer',
      },
      party2: {
        companyName: 'CyberGuard Advisory Group LLC',
        entityType: 'Virginia LLC',
        address: '1200 Tysons Corner Center, McLean, VA 22102',
        email: 'contracts@cyberguardadvisory.com',
        signatoryName: 'David K. Vance',
        signatoryTitle: 'Principal Security Specialist',
      },
      purpose: 'Engaging secondary security auditor to perform penetration testing, architecture review, and SOC2 compliance validation.',
      effectiveDate: new Date().toISOString().split('T')[0],
      mndaTermType: 'until_terminated',
      mndaTermYears: 1,
      confidentialityTermType: 'years',
      confidentialityTermYears: 5,
      governingLawState: 'Delaware',
      jurisdiction: 'federal courts located in New Castle County, DE',
      modifications: 'Standard terms apply in full.',
    },
  },
];

export const DEFAULT_NDA_DATA: NDAData = {
  party1: {
    companyName: 'Apex Innovations Inc.',
    entityType: 'Delaware Corporation',
    address: '100 Innovation Way, Suite 400, Wilmington, DE 19801',
    email: 'legal@apexinnovations.com',
    signatoryName: 'Sarah Jenkins',
    signatoryTitle: 'Chief Executive Officer',
  },
  party2: {
    companyName: 'Nexus Cloud Technologies LLC',
    entityType: 'California LLC',
    address: '500 Technology Parkway, San Francisco, CA 94105',
    email: 'notices@nexuscloud.io',
    signatoryName: 'Marcus Vance',
    signatoryTitle: 'VP of Business Development',
  },
  purpose: 'Evaluating whether to enter into a commercial partnership, software integration, and joint product offering between the parties.',
  effectiveDate: new Date().toISOString().split('T')[0],
  mndaTermType: 'expires_years',
  mndaTermYears: 1,
  confidentialityTermType: 'years',
  confidentialityTermYears: 2,
  governingLawState: 'Delaware',
  jurisdiction: 'federal or state courts located in Wilmington, DE',
  modifications: 'None.',
  includeCoverPage: true,
  highlightVariables: true,
};
