/**
 * WCAG Fix Suggestions Library
 * Provides actionable code examples for common accessibility issues
 */

export interface FixSuggestion {
  id: string;
  title: string;
  description: string;
  wcagCriteria: string[];
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  before: string;
  after: string;
  explanation: string;
  links: { title: string; url: string }[];
}

export const WCAG_FIXES: Record<string, FixSuggestion> = {
  'image-alt': {
    id: 'image-alt',
    title: 'Images must have alt text',
    description: 'All <img> elements must have an alt attribute for screen readers',
    wcagCriteria: ['WCAG 2.1 Level A - 1.1.1 Non-text Content'],
    severity: 'critical',
    before: `<img src="logo.png">`,
    after: `<img src="logo.png" alt="Company Logo">`,
    explanation: 'Add descriptive alt text that conveys the purpose of the image. For decorative images, use alt="".',
    links: [
      { title: 'WCAG 1.1.1', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html' },
      { title: 'Alt Text Guide', url: 'https://webaim.org/techniques/alttext/' }
    ]
  },

  'button-name': {
    id: 'button-name',
    title: 'Buttons must have accessible names',
    description: 'Buttons need text content or aria-label for screen readers',
    wcagCriteria: ['WCAG 2.1 Level A - 4.1.2 Name, Role, Value'],
    severity: 'critical',
    before: `<button><i class="icon-save"></i></button>`,
    after: `<button aria-label="Save changes">
  <i class="icon-save"></i>
</button>`,
    explanation: 'Add aria-label or include visible text within the button. Icon-only buttons must have descriptive labels.',
    links: [
      { title: 'WCAG 4.1.2', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
      { title: 'Accessible Buttons', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/' }
    ]
  },

  'color-contrast': {
    id: 'color-contrast',
    title: 'Text must have sufficient color contrast',
    description: 'Text needs a contrast ratio of at least 4.5:1 (3:1 for large text)',
    wcagCriteria: ['WCAG 2.1 Level AA - 1.4.3 Contrast (Minimum)'],
    severity: 'serious',
    before: `<p style="color: #777; background: #fff;">
  Low contrast text
</p>`,
    after: `<p style="color: #595959; background: #fff;">
  Good contrast text (4.54:1 ratio)
</p>`,
    explanation: 'Adjust colors to meet minimum contrast ratios. Use tools like WebAIM Contrast Checker to verify.',
    links: [
      { title: 'WCAG 1.4.3', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
      { title: 'Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' }
    ]
  },

  'label': {
    id: 'label',
    title: 'Form inputs must have labels',
    description: 'Every input field needs an associated <label> element',
    wcagCriteria: ['WCAG 2.1 Level A - 3.3.2 Labels or Instructions'],
    severity: 'critical',
    before: `<input type="email" name="email" placeholder="Email">`,
    after: `<label for="email">Email address</label>
<input type="email" id="email" name="email">`,
    explanation: 'Associate labels with inputs using the "for" attribute matching the input "id". Avoid relying solely on placeholders.',
    links: [
      { title: 'WCAG 3.3.2', url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html' },
      { title: 'Labeling Form Controls', url: 'https://www.w3.org/WAI/tutorials/forms/labels/' }
    ]
  },

  'link-name': {
    id: 'link-name',
    title: 'Links must have discernible text',
    description: 'Links need meaningful text that describes their destination',
    wcagCriteria: ['WCAG 2.1 Level A - 4.1.2 Name, Role, Value', 'WCAG 2.1 Level A - 2.4.4 Link Purpose'],
    severity: 'serious',
    before: `<a href="/products">Click here</a>`,
    after: `<a href="/products">View our products</a>`,
    explanation: 'Use descriptive link text. Avoid generic phrases like "click here" or "read more".',
    links: [
      { title: 'WCAG 2.4.4', url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html' },
      { title: 'Writing Good Link Text', url: 'https://www.w3.org/QA/Tips/noClickHere' }
    ]
  },

  'document-title': {
    id: 'document-title',
    title: 'Pages must have title elements',
    description: 'Every page needs a unique, descriptive <title>',
    wcagCriteria: ['WCAG 2.1 Level A - 2.4.2 Page Titled'],
    severity: 'serious',
    before: `<head>
  <title>Page</title>
</head>`,
    after: `<head>
  <title>Products - Your Company Name</title>
</head>`,
    explanation: 'Write unique, descriptive titles for each page. Include the page name and site name.',
    links: [
      { title: 'WCAG 2.4.2', url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html' }
    ]
  },

  'html-has-lang': {
    id: 'html-has-lang',
    title: 'HTML element must have lang attribute',
    description: 'The <html> tag needs a lang attribute for screen readers',
    wcagCriteria: ['WCAG 2.1 Level A - 3.1.1 Language of Page'],
    severity: 'serious',
    before: `<html>`,
    after: `<html lang="en">`,
    explanation: 'Add the lang attribute with the appropriate language code (e.g., "en" for English).',
    links: [
      { title: 'WCAG 3.1.1', url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html' },
      { title: 'Language Codes', url: 'https://www.w3.org/International/questions/qa-html-language-declarations' }
    ]
  },

  'duplicate-id': {
    id: 'duplicate-id',
    title: 'ID attributes must be unique',
    description: 'Each id value can only appear once per page',
    wcagCriteria: ['WCAG 2.1 Level A - 4.1.1 Parsing'],
    severity: 'serious',
    before: `<div id="header">...</div>
<div id="header">...</div>`,
    after: `<div id="header-main">...</div>
<div id="header-mobile">...</div>`,
    explanation: 'Ensure all id values are unique. Use classes for styling multiple elements.',
    links: [
      { title: 'WCAG 4.1.1', url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html' }
    ]
  },

  'heading-order': {
    id: 'heading-order',
    title: 'Headings must be in logical order',
    description: 'Heading levels should not skip (e.g., h1 → h3)',
    wcagCriteria: ['WCAG 2.1 Level A - 1.3.1 Info and Relationships'],
    severity: 'moderate',
    before: `<h1>Main Title</h1>
<h3>Subsection</h3>`,
    after: `<h1>Main Title</h1>
<h2>Subsection</h2>`,
    explanation: 'Use heading levels sequentially. Don\'t skip levels for visual styling - use CSS instead.',
    links: [
      { title: 'WCAG 1.3.1', url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
      { title: 'Heading Structure', url: 'https://webaim.org/techniques/semanticstructure/' }
    ]
  },

  'list': {
    id: 'list',
    title: 'Lists must be properly structured',
    description: 'List items (<li>) must be contained in <ul>, <ol>, or <dl>',
    wcagCriteria: ['WCAG 2.1 Level A - 1.3.1 Info and Relationships'],
    severity: 'moderate',
    before: `<div>
  <li>Item 1</li>
  <li>Item 2</li>
</div>`,
    after: `<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>`,
    explanation: 'Always wrap list items in proper list containers. Use <ul> for unordered, <ol> for ordered lists.',
    links: [
      { title: 'WCAG 1.3.1', url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
      { title: 'Semantic Lists', url: 'https://www.w3.org/WAI/tutorials/page-structure/content/#lists' }
    ]
  },

  'aria-hidden-focus': {
    id: 'aria-hidden-focus',
    title: 'Focusable elements must not have aria-hidden',
    description: 'Elements with aria-hidden="true" should not be focusable',
    wcagCriteria: ['WCAG 2.1 Level A - 4.1.2 Name, Role, Value'],
    severity: 'serious',
    before: `<button aria-hidden="true">
  Click me
</button>`,
    after: `<button style="display: none;">
  Click me
</button>
<!-- Or remove aria-hidden if button should be visible -->`,
    explanation: 'Don\'t use aria-hidden on interactive elements. Use display: none or visibility: hidden instead.',
    links: [
      { title: 'WCAG 4.1.2', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
      { title: 'ARIA Hidden', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden' }
    ]
  },

  'aria-required-attr': {
    id: 'aria-required-attr',
    title: 'ARIA roles must have required attributes',
    description: 'Certain ARIA roles require specific attributes',
    wcagCriteria: ['WCAG 2.1 Level A - 4.1.2 Name, Role, Value'],
    severity: 'critical',
    before: `<div role="checkbox">
  Option
</div>`,
    after: `<div role="checkbox"
     aria-checked="false"
     tabindex="0">
  Option
</div>`,
    explanation: 'Include all required ARIA attributes for the role. Checkboxes need aria-checked and tabindex.',
    links: [
      { title: 'WCAG 4.1.2', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
      { title: 'ARIA Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' }
    ]
  },

  'tabindex': {
    id: 'tabindex',
    title: 'Avoid positive tabindex values',
    description: 'Positive tabindex values disrupt natural tab order',
    wcagCriteria: ['WCAG 2.1 Level A - 2.4.3 Focus Order'],
    severity: 'serious',
    before: `<input type="text" tabindex="5">`,
    after: `<input type="text" tabindex="0">
<!-- Or remove tabindex to use natural order -->`,
    explanation: 'Use tabindex="0" to add elements to tab order, or "-1" to remove them. Avoid positive values.',
    links: [
      { title: 'WCAG 2.4.3', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html' },
      { title: 'Using Tabindex', url: 'https://www.a11yproject.com/posts/how-to-use-the-tabindex-attribute/' }
    ]
  }
};

/**
 * Get fix suggestions for a specific WCAG violation ID
 */
export function getFixSuggestion(ruleId: string): FixSuggestion | null {
  return WCAG_FIXES[ruleId] || null;
}

/**
 * Get all fix suggestions
 */
export function getAllFixSuggestions(): FixSuggestion[] {
  return Object.values(WCAG_FIXES);
}

/**
 * Search fix suggestions by keyword
 */
export function searchFixSuggestions(query: string): FixSuggestion[] {
  const lowerQuery = query.toLowerCase();
  return getAllFixSuggestions().filter(
    (fix) =>
      fix.title.toLowerCase().includes(lowerQuery) ||
      fix.description.toLowerCase().includes(lowerQuery) ||
      fix.id.toLowerCase().includes(lowerQuery)
  );
}
