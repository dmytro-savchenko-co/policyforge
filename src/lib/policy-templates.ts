export interface PolicyFormData {
  businessName: string;
  websiteUrl: string;
  businessType: "website" | "app" | "saas" | "ecommerce" | "blog";
  contactEmail: string;
  country: string;
  jurisdictions: string[];
  dataCollected: string[];
  thirdPartyServices: string[];
  cookieTypes: string[];
  hasUserAccounts: boolean;
  sellsProducts: boolean;
  refundDays: number;
  language: string;
}

const currentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function generatePrivacyPolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Privacy Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This Privacy Policy describes how ${data.businessName} ("we," "us," or "our") collects, uses, and shares information about you when you use our ${data.businessType === "app" ? "application" : data.businessType === "saas" ? "software service" : "website"} located at ${data.websiteUrl} (the "Service").</p>`);
  sections.push(`<p>By using our Service, you agree to the collection and use of information in accordance with this policy.</p>`);

  // Information We Collect
  sections.push(`<h2>1. Information We Collect</h2>`);
  sections.push(`<h3>Information You Provide to Us</h3>`);

  const providedData: string[] = [];
  if (data.dataCollected.includes("name")) providedData.push("Name and contact information");
  if (data.dataCollected.includes("email")) providedData.push("Email address");
  if (data.dataCollected.includes("phone")) providedData.push("Phone number");
  if (data.dataCollected.includes("address")) providedData.push("Mailing or billing address");
  if (data.dataCollected.includes("payment")) providedData.push("Payment and billing information (processed securely through our payment processor)");
  if (data.hasUserAccounts) providedData.push("Account credentials (username and password)");
  if (data.dataCollected.includes("content")) providedData.push("Content you submit, post, or share through the Service");

  if (providedData.length > 0) {
    sections.push(`<p>We collect information you provide directly to us, including:</p>`);
    sections.push(`<ul>${providedData.map((d) => `<li>${d}</li>`).join("")}</ul>`);
  }

  sections.push(`<h3>Information We Collect Automatically</h3>`);
  sections.push(`<p>When you use our Service, we automatically collect certain information, including:</p>`);
  sections.push(`<ul>
    <li>Log data (IP address, browser type, operating system, referring URLs, pages viewed, and dates/times of visits)</li>
    <li>Device information (device type, unique device identifiers, and device settings)</li>
    ${data.dataCollected.includes("location") ? "<li>Approximate location data derived from your IP address</li>" : ""}
    ${data.dataCollected.includes("cookies") ? "<li>Cookies and similar tracking technologies (see our Cookie Policy for details)</li>" : ""}
  </ul>`);

  // How We Use
  sections.push(`<h2>2. How We Use Your Information</h2>`);
  sections.push(`<p>We use the information we collect to:</p>`);
  sections.push(`<ul>
    <li>Provide, maintain, and improve our Service</li>
    <li>Process transactions and send related information</li>
    <li>Send you technical notices, updates, security alerts, and administrative messages</li>
    <li>Respond to your comments, questions, and customer service requests</li>
    ${data.dataCollected.includes("email") ? "<li>Send you marketing communications (you can opt out at any time)</li>" : ""}
    <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
    <li>Comply with legal obligations</li>
  </ul>`);

  // Third Party Services
  if (data.thirdPartyServices.length > 0) {
    sections.push(`<h2>3. Third-Party Services</h2>`);
    sections.push(`<p>We may share your information with the following third-party service providers:</p>`);
    sections.push(`<ul>${data.thirdPartyServices.map((s) => {
      const serviceDescriptions: Record<string, string> = {
        "google-analytics": "Google Analytics — for website analytics and usage tracking",
        "stripe": "Stripe — for payment processing",
        "mailchimp": "Mailchimp — for email marketing",
        "intercom": "Intercom — for customer support and messaging",
        "facebook-pixel": "Meta/Facebook Pixel — for advertising and analytics",
        "hotjar": "Hotjar — for behavior analytics and user feedback",
        "sentry": "Sentry — for error tracking and monitoring",
        "cloudflare": "Cloudflare — for content delivery and security",
        "aws": "Amazon Web Services — for cloud hosting and data storage",
        "google-ads": "Google Ads — for advertising",
      };
      return `<li>${serviceDescriptions[s] || s}</li>`;
    }).join("")}</ul>`);
    sections.push(`<p>These third-party services have their own privacy policies and may collect information as described in their respective privacy policies.</p>`);
  }

  // Data Retention
  sections.push(`<h2>${data.thirdPartyServices.length > 0 ? "4" : "3"}. Data Retention</h2>`);
  sections.push(`<p>We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>`);

  // GDPR Section
  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>Your Rights Under GDPR (European Economic Area)</h2>`);
    sections.push(`<p>If you are located in the European Economic Area (EEA), you have the following data protection rights under the General Data Protection Regulation (GDPR):</p>`);
    sections.push(`<ul>
      <li><strong>Right of Access:</strong> You have the right to request copies of your personal data.</li>
      <li><strong>Right to Rectification:</strong> You have the right to request correction of inaccurate personal data.</li>
      <li><strong>Right to Erasure:</strong> You have the right to request deletion of your personal data under certain conditions.</li>
      <li><strong>Right to Restrict Processing:</strong> You have the right to request restriction of processing of your personal data.</li>
      <li><strong>Right to Data Portability:</strong> You have the right to request transfer of your data to another organization or directly to you.</li>
      <li><strong>Right to Object:</strong> You have the right to object to our processing of your personal data.</li>
    </ul>`);
    sections.push(`<p>To exercise any of these rights, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We will respond to your request within 30 days.</p>`);
    sections.push(`<p><strong>Legal Basis for Processing:</strong> We process your personal data based on: (a) your consent, (b) the necessity for the performance of a contract, (c) compliance with legal obligations, and/or (d) our legitimate interests.</p>`);
  }

  // CCPA Section
  if (data.jurisdictions.includes("ccpa")) {
    sections.push(`<h2>Your Rights Under CCPA (California)</h2>`);
    sections.push(`<p>If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):</p>`);
    sections.push(`<ul>
      <li><strong>Right to Know:</strong> You have the right to know what personal information we collect, use, disclose, and sell.</li>
      <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information.</li>
      <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the sale of your personal information. We do not sell your personal information.</li>
      <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
    </ul>`);
    sections.push(`<p>To exercise your rights, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We will verify your identity and respond within 45 days.</p>`);
  }

  // PIPEDA Section
  if (data.jurisdictions.includes("pipeda")) {
    sections.push(`<h2>Your Rights Under PIPEDA (Canada)</h2>`);
    sections.push(`<p>If you are a Canadian resident, you have rights under the Personal Information Protection and Electronic Documents Act (PIPEDA), including:</p>`);
    sections.push(`<ul>
      <li>The right to access your personal information held by us</li>
      <li>The right to challenge the accuracy and completeness of your information</li>
      <li>The right to withdraw consent for the collection, use, or disclosure of your information</li>
    </ul>`);
    sections.push(`<p>To exercise any of these rights, contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);
  }

  // Children's Privacy
  sections.push(`<h2>Children's Privacy</h2>`);
  sections.push(`<p>Our Service is not directed to children under the age of 16 (or 13 in jurisdictions where applicable). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> and we will promptly delete such information.</p>`);

  // Security
  sections.push(`<h2>Security</h2>`);
  sections.push(`<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>`);

  // Changes
  sections.push(`<h2>Changes to This Privacy Policy</h2>`);
  sections.push(`<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>`);

  // Contact
  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this Privacy Policy, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateTermsOfService(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Terms of Service for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>Please read these Terms of Service ("Terms") carefully before using ${data.websiteUrl} (the "Service") operated by ${data.businessName} ("us," "we," or "our").</p>`);

  sections.push(`<h2>1. Acceptance of Terms</h2>`);
  sections.push(`<p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>`);

  sections.push(`<h2>2. Description of Service</h2>`);
  sections.push(`<p>${data.businessName} provides ${
    data.businessType === "saas" ? "a software-as-a-service platform" :
    data.businessType === "ecommerce" ? "an online marketplace and e-commerce platform" :
    data.businessType === "app" ? "a mobile and/or web application" :
    data.businessType === "blog" ? "an online content and publishing platform" :
    "an online platform and website"
  } accessible at ${data.websiteUrl}.</p>`);

  if (data.hasUserAccounts) {
    sections.push(`<h2>3. User Accounts</h2>`);
    sections.push(`<p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account password and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>`);
  }

  sections.push(`<h2>${data.hasUserAccounts ? "4" : "3"}. Intellectual Property</h2>`);
  sections.push(`<p>The Service and its original content, features, and functionality are and will remain the exclusive property of ${data.businessName}. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>`);

  sections.push(`<h2>Prohibited Uses</h2>`);
  sections.push(`<p>You agree not to use the Service:</p>`);
  sections.push(`<ul>
    <li>In any way that violates any applicable law or regulation</li>
    <li>To transmit any advertising or promotional material without our prior written consent</li>
    <li>To impersonate or attempt to impersonate the Company, an employee, another user, or any other person</li>
    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
    <li>To introduce any viruses, trojan horses, worms, or other malicious code</li>
    <li>To attempt to gain unauthorized access to any portion of the Service</li>
  </ul>`);

  if (data.sellsProducts || data.businessType === "ecommerce" || data.businessType === "saas") {
    sections.push(`<h2>Payments and Billing</h2>`);
    sections.push(`<p>Certain features of the Service may require payment. You agree to provide current, complete, and accurate billing information. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.</p>`);
    if (data.businessType === "saas") {
      sections.push(`<p>Subscriptions are billed in advance on a recurring basis (monthly or annually, depending on the plan selected). You may cancel your subscription at any time, and cancellation will take effect at the end of the current billing period.</p>`);
    }
  }

  sections.push(`<h2>Limitation of Liability</h2>`);
  sections.push(`<p>In no event shall ${data.businessName}, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.</p>`);

  sections.push(`<h2>Disclaimer</h2>`);
  sections.push(`<p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>`);

  sections.push(`<h2>Governing Law</h2>`);
  sections.push(`<p>These Terms shall be governed and construed in accordance with the laws of ${data.country || "the jurisdiction in which the Company operates"}, without regard to its conflict of law provisions.</p>`);

  sections.push(`<h2>Changes to Terms</h2>`);
  sections.push(`<p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about these Terms, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}

export function generateCookiePolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Cookie Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This Cookie Policy explains how ${data.businessName} ("we," "us," or "our") uses cookies and similar technologies on ${data.websiteUrl}. By using our website, you consent to our use of cookies in accordance with this policy.</p>`);

  sections.push(`<h2>What Are Cookies?</h2>`);
  sections.push(`<p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies can be "persistent" (remaining on your device until deleted) or "session" cookies (deleted when you close your browser).</p>`);

  sections.push(`<h2>How We Use Cookies</h2>`);
  sections.push(`<p>We use the following types of cookies:</p>`);

  const cookieList: string[] = [];
  if (data.cookieTypes.includes("essential")) {
    cookieList.push(`<li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.</li>`);
  }
  if (data.cookieTypes.includes("analytics")) {
    cookieList.push(`<li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and your experience.</li>`);
  }
  if (data.cookieTypes.includes("functional")) {
    cookieList.push(`<li><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</li>`);
  }
  if (data.cookieTypes.includes("marketing")) {
    cookieList.push(`<li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites to display relevant advertisements. They are usually placed by third-party advertising networks with our permission.</li>`);
  }
  sections.push(`<ul>${cookieList.join("")}</ul>`);

  if (data.thirdPartyServices.length > 0) {
    sections.push(`<h2>Third-Party Cookies</h2>`);
    sections.push(`<p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. The third-party services we use include:</p>`);
    sections.push(`<ul>${data.thirdPartyServices.map((s) => `<li>${s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</li>`).join("")}</ul>`);
  }

  sections.push(`<h2>Managing Cookies</h2>`);
  sections.push(`<p>Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to alert you when a cookie is being sent. However, if you disable cookies, some parts of our website may not function properly.</p>`);
  sections.push(`<p>To manage your cookie preferences:</p>`);
  sections.push(`<ul>
    <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
    <li><strong>Edge:</strong> Settings → Cookies and Site Permissions → Cookies</li>
  </ul>`);

  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>Your Rights (GDPR)</h2>`);
    sections.push(`<p>Under GDPR, you have the right to consent to or reject non-essential cookies. We will ask for your consent before placing any non-essential cookies on your device. You can withdraw your consent at any time by adjusting your cookie settings on our website.</p>`);
  }

  sections.push(`<h2>Changes to This Cookie Policy</h2>`);
  sections.push(`<p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about our use of cookies, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}

export function generateRefundPolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Refund Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);

  if (data.businessType === "saas") {
    sections.push(`<h2>Subscription Refunds</h2>`);
    sections.push(`<p>We offer a ${data.refundDays}-day money-back guarantee on all new subscriptions. If you are not satisfied with our service, you may request a full refund within ${data.refundDays} days of your initial purchase.</p>`);
    sections.push(`<h2>How to Request a Refund</h2>`);
    sections.push(`<p>To request a refund, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> with your account details and the reason for your refund request. We will process your request within 5-10 business days.</p>`);
    sections.push(`<h2>Cancellation</h2>`);
    sections.push(`<p>You may cancel your subscription at any time. Upon cancellation, you will continue to have access to the Service until the end of your current billing period. No refunds will be issued for partial billing periods after the ${data.refundDays}-day guarantee window.</p>`);
  } else if (data.businessType === "ecommerce") {
    sections.push(`<h2>Return Policy</h2>`);
    sections.push(`<p>We accept returns within ${data.refundDays} days of delivery. Items must be unused, in their original packaging, and in the same condition as when you received them.</p>`);
    sections.push(`<h2>Refund Process</h2>`);
    sections.push(`<p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original payment method within 5-10 business days.</p>`);
    sections.push(`<h2>Shipping Costs</h2>`);
    sections.push(`<p>Shipping costs for returns are the responsibility of the customer, unless the return is due to a defective or incorrect item. In such cases, we will provide a prepaid return label.</p>`);
  } else {
    sections.push(`<h2>Refunds</h2>`);
    sections.push(`<p>If you are not satisfied with our service, you may request a refund within ${data.refundDays} days of purchase. Please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> with your request.</p>`);
  }

  sections.push(`<h2>Non-Refundable Items</h2>`);
  sections.push(`<ul>
    <li>Services that have been fully rendered or consumed</li>
    <li>Digital products that have been downloaded or accessed</li>
    <li>Custom or personalized orders</li>
  </ul>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>For any questions about our refund policy, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}

export function generateEULA(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>End-User License Agreement (EULA) for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This End-User License Agreement ("Agreement") is a legal agreement between you ("User") and ${data.businessName} ("Licensor," "we," "us," or "our") for the use of our ${data.businessType === "app" ? "application" : data.businessType === "saas" ? "software service" : "software"} available at ${data.websiteUrl} (the "Software").</p>`);
  sections.push(`<p>By installing, copying, or otherwise using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to these terms, do not install or use the Software.</p>`);

  sections.push(`<h2>1. License Grant</h2>`);
  sections.push(`<p>${data.businessName} grants you a limited, non-exclusive, non-transferable, revocable license to use the Software for your personal or internal business purposes, subject to the terms of this Agreement.</p>`);

  sections.push(`<h2>2. Restrictions</h2>`);
  sections.push(`<p>You agree not to:</p>`);
  sections.push(`<ul>
    <li>Copy, modify, or distribute the Software or any portion thereof</li>
    <li>Reverse engineer, decompile, or disassemble the Software</li>
    <li>Rent, lease, lend, sell, sublicense, or otherwise transfer the Software to any third party</li>
    <li>Remove, alter, or obscure any proprietary notices on the Software</li>
    <li>Use the Software for any unlawful purpose or in violation of any applicable laws</li>
    <li>Use the Software to develop a competing product or service</li>
  </ul>`);

  sections.push(`<h2>3. Intellectual Property</h2>`);
  sections.push(`<p>The Software and all copies thereof are proprietary to ${data.businessName} and title thereto remains in ${data.businessName}. The Software is protected by copyright and other intellectual property laws and treaties. ${data.businessName} owns all rights, title, and interest in and to the Software, including all intellectual property rights therein.</p>`);

  if (data.hasUserAccounts) {
    sections.push(`<h2>4. User Accounts</h2>`);
    sections.push(`<p>You may be required to create an account to access certain features of the Software. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>`);
  }

  sections.push(`<h2>${data.hasUserAccounts ? "5" : "4"}. Termination</h2>`);
  sections.push(`<p>This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice if you fail to comply with any of its terms. Upon termination, you must cease all use of the Software and destroy all copies in your possession.</p>`);
  sections.push(`<p>${data.businessName} may also terminate this Agreement at any time for any reason by providing notice to you. Upon such termination, you must immediately cease using the Software.</p>`);

  sections.push(`<h2>Disclaimer of Warranties</h2>`);
  sections.push(`<p>THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. ${data.businessName.toUpperCase()} DOES NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>`);

  sections.push(`<h2>Limitation of Liability</h2>`);
  sections.push(`<p>IN NO EVENT SHALL ${data.businessName.toUpperCase()} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF ${data.businessName.toUpperCase()} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>`);

  // Jurisdiction-specific
  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>European Union Users</h2>`);
    sections.push(`<p>If you are located in the European Union, this Agreement does not limit any rights you may have under mandatory consumer protection laws in your jurisdiction. Any personal data collected through the Software will be processed in accordance with our Privacy Policy and applicable data protection laws, including the General Data Protection Regulation (GDPR).</p>`);
  }

  if (data.jurisdictions.includes("ccpa")) {
    sections.push(`<h2>California Users</h2>`);
    sections.push(`<p>If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA). Please refer to our Privacy Policy for more information about how we handle your personal information.</p>`);
  }

  sections.push(`<h2>Governing Law</h2>`);
  sections.push(`<p>This Agreement shall be governed by and construed in accordance with the laws of ${data.country || "the jurisdiction in which the Licensor operates"}, without regard to its conflict of law provisions.</p>`);

  sections.push(`<h2>Changes to This Agreement</h2>`);
  sections.push(`<p>We reserve the right to modify this Agreement at any time. We will notify you of significant changes by posting the updated Agreement on our website. Your continued use of the Software after changes are posted constitutes acceptance of the modified Agreement.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this EULA, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateDisclaimer(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Disclaimer for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>The information provided by ${data.businessName} ("we," "us," or "our") on ${data.websiteUrl} (the "Site") is for general informational purposes only. All information on the Site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>`);

  sections.push(`<h2>1. General Disclaimer</h2>`);
  sections.push(`<p>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>`);

  sections.push(`<h2>2. External Links Disclaimer</h2>`);
  sections.push(`<p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>`);
  sections.push(`<p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site or any website or feature linked in any banner or other advertising.</p>`);

  sections.push(`<h2>3. Professional Disclaimer</h2>`);
  sections.push(`<p>The Site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>`);
  sections.push(`<p>We do not provide any kind of professional advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>`);

  sections.push(`<h2>4. Testimonials Disclaimer</h2>`);
  sections.push(`<p>The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.</p>`);

  if (data.businessType === "blog") {
    sections.push(`<h2>5. Content Disclaimer</h2>`);
    sections.push(`<p>The views and opinions expressed in the blog posts and articles on this Site are those of the authors and do not necessarily reflect the official policy or position of ${data.businessName}. Any content provided by our contributors is of their opinion and is not intended to malign any religion, ethnic group, club, organization, company, individual, or anyone or anything.</p>`);
  }

  if (data.businessType === "ecommerce" || data.sellsProducts) {
    sections.push(`<h2>Products and Services Disclaimer</h2>`);
    sections.push(`<p>All products and services are provided on an "as is" and "as available" basis. ${data.businessName} makes no representations or warranties of any kind, express or implied, as to the operation of the Site or the products and services included on the Site. You expressly agree that your use of the Site and any purchases made through the Site are at your sole risk.</p>`);
  }

  sections.push(`<h2>Errors and Omissions Disclaimer</h2>`);
  sections.push(`<p>While we have made every attempt to ensure that the information contained in this Site has been obtained from reliable sources, ${data.businessName} is not responsible for any errors or omissions or for the results obtained from the use of this information. All information on the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information.</p>`);

  sections.push(`<h2>Fair Use Disclaimer</h2>`);
  sections.push(`<p>This Site may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We believe this constitutes a "fair use" of any such copyrighted material as provided for in applicable copyright law. If you wish to use copyrighted material from this Site for purposes that go beyond "fair use," you must obtain permission from the copyright owner.</p>`);

  sections.push(`<h2>Changes to This Disclaimer</h2>`);
  sections.push(`<p>We reserve the right to make changes to this Disclaimer at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Disclaimer. Any changes or modifications will be effective immediately upon posting the updated Disclaimer on the Site.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this Disclaimer, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateAcceptableUse(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Acceptable Use Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This Acceptable Use Policy ("Policy") sets forth the rules and guidelines for using ${data.websiteUrl} (the "Service") operated by ${data.businessName} ("we," "us," or "our"). By accessing or using our Service, you agree to comply with this Policy.</p>`);

  sections.push(`<h2>1. Permitted Use</h2>`);
  sections.push(`<p>You may use our Service only for lawful purposes and in accordance with this Policy. You agree to use the Service in a manner consistent with all applicable local, state, national, and international laws and regulations.</p>`);

  sections.push(`<h2>2. Prohibited Activities</h2>`);
  sections.push(`<p>You agree NOT to use the Service to:</p>`);
  sections.push(`<ul>
    <li>Violate any applicable law, regulation, or legal obligation</li>
    <li>Infringe on the intellectual property rights of others</li>
    <li>Transmit any material that is defamatory, obscene, threatening, abusive, or hateful</li>
    <li>Distribute unsolicited commercial messages (spam) or engage in phishing</li>
    <li>Upload or transmit viruses, malware, or other malicious code</li>
    <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
    <li>Interfere with or disrupt the integrity or performance of the Service</li>
    <li>Collect or harvest personal information of other users without their consent</li>
    <li>Engage in any activity that could damage, disable, overburden, or impair the Service</li>
    <li>Use the Service in any manner that could interfere with other parties' use and enjoyment of the Service</li>
  </ul>`);

  sections.push(`<h2>3. Content Standards</h2>`);
  sections.push(`<p>Any content you submit, post, or share through the Service must comply with the following standards:</p>`);
  sections.push(`<ul>
    <li>Must not contain any material that is false, misleading, or fraudulent</li>
    <li>Must not infringe any patent, trademark, trade secret, copyright, or other intellectual property rights</li>
    <li>Must not violate the privacy or publicity rights of any third party</li>
    <li>Must not contain any material that promotes violence, discrimination, or illegal activities</li>
    <li>Must not contain sexually explicit content unless the Service is specifically designed for such content</li>
    <li>Must not impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
  </ul>`);

  if (data.hasUserAccounts) {
    sections.push(`<h2>4. Account Responsibilities</h2>`);
    sections.push(`<p>If you create an account on our Service, you are responsible for:</p>`);
    sections.push(`<ul>
      <li>Maintaining the security and confidentiality of your login credentials</li>
      <li>All activities that occur under your account</li>
      <li>Immediately notifying us of any unauthorized use of your account</li>
      <li>Ensuring that your account information is accurate and up to date</li>
    </ul>`);
    sections.push(`<p>We reserve the right to suspend or terminate accounts that violate this Policy.</p>`);
  }

  sections.push(`<h2>${data.hasUserAccounts ? "5" : "4"}. Network and System Security</h2>`);
  sections.push(`<p>You may not use the Service to:</p>`);
  sections.push(`<ul>
    <li>Probe, scan, or test the vulnerability of any system or network</li>
    <li>Breach any security or authentication measures</li>
    <li>Access, tamper with, or use non-public areas of the Service or shared areas you have not been invited to</li>
    <li>Send altered, deceptive, or false source-identifying information (such as forged TCP-IP packet headers)</li>
    <li>Interfere with or disrupt any user, host, or network, for example by flooding, overloading, or mail-bombing</li>
  </ul>`);

  // Jurisdiction-specific
  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>EU Users — Data Protection</h2>`);
    sections.push(`<p>If you are located in the European Union, you must comply with all applicable data protection laws, including the GDPR, when using our Service. You must not use the Service in any way that would cause us to violate our obligations under the GDPR.</p>`);
  }

  if (data.jurisdictions.includes("ccpa")) {
    sections.push(`<h2>California Users</h2>`);
    sections.push(`<p>California residents have certain rights under the CCPA. You must not use our Service to collect, sell, or share the personal information of California residents in violation of the CCPA.</p>`);
  }

  sections.push(`<h2>Enforcement</h2>`);
  sections.push(`<p>We reserve the right to investigate and take appropriate action against anyone who, in our sole discretion, violates this Policy. Such actions may include:</p>`);
  sections.push(`<ul>
    <li>Issuing a warning</li>
    <li>Temporarily or permanently suspending or terminating your access to the Service</li>
    <li>Removing any content that violates this Policy</li>
    <li>Reporting violations to law enforcement authorities</li>
    <li>Pursuing legal remedies</li>
  </ul>`);

  sections.push(`<h2>Reporting Violations</h2>`);
  sections.push(`<p>If you become aware of any violation of this Policy, please report it to us immediately at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We take all reports seriously and will investigate promptly.</p>`);

  sections.push(`<h2>Changes to This Policy</h2>`);
  sections.push(`<p>We may update this Acceptable Use Policy from time to time. We will notify you of any changes by posting the new Policy on this page and updating the "Last updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the updated Policy.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this Acceptable Use Policy, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateShippingPolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Shipping Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>Thank you for shopping at ${data.businessName}. This Shipping Policy outlines the terms and conditions for shipping of products purchased through ${data.websiteUrl} (the "Site").</p>`);

  sections.push(`<h2>1. Processing Time</h2>`);
  sections.push(`<p>All orders are processed within 1-3 business days after receiving your order confirmation. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional time for your order to be processed during peak periods.</p>`);

  sections.push(`<h2>2. Shipping Methods and Delivery Times</h2>`);
  sections.push(`<p>We offer the following shipping options:</p>`);
  sections.push(`<ul>
    <li><strong>Standard Shipping:</strong> 5-7 business days</li>
    <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
    <li><strong>Express Shipping:</strong> 1-2 business days</li>
  </ul>`);
  sections.push(`<p>Delivery times are estimates and are not guaranteed. Actual delivery times may vary based on your location and other factors outside our control.</p>`);

  sections.push(`<h2>3. Shipping Costs</h2>`);
  sections.push(`<p>Shipping costs are calculated at checkout based on the weight, dimensions, and destination of the items in your order. We may offer free shipping on orders that meet certain criteria, which will be clearly indicated on the Site.</p>`);

  sections.push(`<h2>4. Domestic Shipping</h2>`);
  sections.push(`<p>We ship to all addresses within ${data.country || "our operating country"}. Certain remote or restricted areas may require additional shipping time.</p>`);

  sections.push(`<h2>5. International Shipping</h2>`);
  sections.push(`<p>We offer international shipping to select countries. Please note that international shipments may be subject to import duties, taxes, and customs fees, which are the responsibility of the recipient. ${data.businessName} has no control over these charges and cannot predict their amount.</p>`);
  sections.push(`<p>International delivery times typically range from 7-21 business days, depending on the destination country and customs processing times.</p>`);

  sections.push(`<h2>6. Order Tracking</h2>`);
  sections.push(`<p>Once your order has shipped, you will receive a shipping confirmation email with a tracking number. You can use this tracking number to monitor the status of your shipment. Please allow up to 48 hours for tracking information to become available.</p>`);

  sections.push(`<h2>7. Shipping Delays</h2>`);
  sections.push(`<p>While we strive to deliver your order on time, delays may occur due to:</p>`);
  sections.push(`<ul>
    <li>Weather conditions or natural disasters</li>
    <li>Carrier delays or disruptions</li>
    <li>Customs processing for international orders</li>
    <li>Incorrect or incomplete shipping information provided at checkout</li>
    <li>High order volumes during peak seasons or promotional events</li>
  </ul>`);

  if (data.refundDays > 0) {
    sections.push(`<h2>8. Lost or Damaged Packages</h2>`);
    sections.push(`<p>If your package is lost or arrives damaged, please contact us within ${data.refundDays} days of the expected delivery date at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We will work with the shipping carrier to resolve the issue and may reship the order or issue a refund at our discretion.</p>`);
  }

  sections.push(`<h2>Returns and Exchanges</h2>`);
  sections.push(`<p>For information about returns and exchanges, please refer to our Refund Policy. Return shipping costs are the responsibility of the customer unless the return is due to an error on our part (e.g., wrong item shipped, defective product).</p>`);

  sections.push(`<h2>Changes to This Policy</h2>`);
  sections.push(`<p>We reserve the right to update this Shipping Policy at any time. Changes will be posted on this page with an updated revision date.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about our shipping policy, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateAccessibility(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Accessibility Statement for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>${data.businessName} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>`);

  sections.push(`<h2>1. Our Commitment</h2>`);
  sections.push(`<p>${data.businessName} strives to ensure that its ${data.businessType === "app" ? "application" : data.businessType === "saas" ? "software service" : "website"} at ${data.websiteUrl} is accessible to people with disabilities. We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level, which defines requirements for designers and developers to improve accessibility for people with disabilities.</p>`);

  sections.push(`<h2>2. Conformance Status</h2>`);
  sections.push(`<p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. ${data.businessName} aims to conform to WCAG 2.1 Level AA. We are actively working to increase the accessibility and usability of our ${data.businessType === "app" ? "application" : "website"}.</p>`);

  sections.push(`<h2>3. Measures Taken</h2>`);
  sections.push(`<p>${data.businessName} takes the following measures to ensure accessibility:</p>`);
  sections.push(`<ul>
    <li>Include accessibility as part of our mission statement</li>
    <li>Integrate accessibility into our procurement practices</li>
    <li>Provide continual accessibility training for our staff</li>
    <li>Assign clear accessibility goals and responsibilities</li>
    <li>Employ formal accessibility quality assurance methods</li>
    <li>Conduct regular accessibility audits using automated tools and manual testing</li>
  </ul>`);

  sections.push(`<h2>4. Accessibility Features</h2>`);
  sections.push(`<p>Our ${data.businessType === "app" ? "application" : "website"} includes the following accessibility features:</p>`);
  sections.push(`<ul>
    <li><strong>Keyboard Navigation:</strong> All functionality is accessible via keyboard for users who cannot use a mouse</li>
    <li><strong>Screen Reader Compatibility:</strong> Content is structured with proper headings, labels, and ARIA attributes for screen reader users</li>
    <li><strong>Text Alternatives:</strong> Images and non-text content include descriptive alternative text</li>
    <li><strong>Color Contrast:</strong> Text and interactive elements meet minimum contrast ratio requirements</li>
    <li><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of content or functionality</li>
    <li><strong>Focus Indicators:</strong> Visible focus indicators are provided for all interactive elements</li>
    <li><strong>Consistent Navigation:</strong> Navigation mechanisms are consistent and predictable throughout the site</li>
  </ul>`);

  sections.push(`<h2>5. Known Limitations</h2>`);
  sections.push(`<p>Despite our best efforts, some content may not yet be fully accessible. We are aware of the following limitations and are actively working to address them:</p>`);
  sections.push(`<ul>
    <li>Some older PDF documents may not be fully accessible to screen readers</li>
    <li>Some third-party content or features may not fully meet accessibility standards</li>
    <li>Some video content may not yet have captions or audio descriptions</li>
  </ul>`);
  sections.push(`<p>We are actively working to resolve these issues and improve the overall accessibility of our ${data.businessType === "app" ? "application" : "website"}.</p>`);

  sections.push(`<h2>6. Assistive Technologies</h2>`);
  sections.push(`<p>Our ${data.businessType === "app" ? "application" : "website"} is designed to be compatible with the following assistive technologies:</p>`);
  sections.push(`<ul>
    <li>Screen readers (including JAWS, NVDA, and VoiceOver)</li>
    <li>Screen magnification software</li>
    <li>Speech recognition software</li>
    <li>Keyboard-only navigation</li>
    <li>Switch access devices</li>
  </ul>`);

  sections.push(`<h2>7. Standards and Guidelines</h2>`);
  sections.push(`<p>This statement references the following standards and guidelines:</p>`);
  sections.push(`<ul>
    <li><strong>WCAG 2.1:</strong> Web Content Accessibility Guidelines, published by the Web Accessibility Initiative (WAI) of the World Wide Web Consortium (W3C)</li>
    <li><strong>ADA:</strong> Americans with Disabilities Act, Title III — which applies to places of public accommodation, including websites</li>
    <li><strong>Section 508:</strong> Section 508 of the Rehabilitation Act, requiring federal agencies to make electronic and information technology accessible</li>
    <li><strong>EN 301 549:</strong> European standard for digital accessibility</li>
  </ul>`);

  sections.push(`<h2>8. Feedback</h2>`);
  sections.push(`<p>We welcome your feedback on the accessibility of ${data.businessName}. Please let us know if you encounter accessibility barriers:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);
  sections.push(`<p>We try to respond to accessibility feedback within 5 business days.</p>`);

  sections.push(`<h2>9. Enforcement Procedures</h2>`);
  sections.push(`<p>If you are not satisfied with our response to your accessibility concern, you may escalate the issue to the relevant regulatory body in your jurisdiction. In the United States, you may file a complaint with the Department of Justice (ADA) or the U.S. Access Board (Section 508).</p>`);

  return sections.join("\n");
}
