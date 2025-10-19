export interface FixSuggestion {
  id: string;
  title: string;
  description: string;
  beforeCode: string;
  afterCode: string;
  explanation: string;
  wcagLink: string;
}

export const fixSuggestions: Record<string, FixSuggestion> = {
  'button-name': {
    id: 'button-name',
    title: 'Add accessible name to button',
    description: 'Buttons must have discernible text that clearly indicates their purpose.',
    beforeCode: '<button><i class="icon-save"></i></button>',
    afterCode: '<button aria-label="Save document"><i class="icon-save"></i></button>',
    explanation: 'Add aria-label or visible text content to the button so screen readers can announce its purpose.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },

  'image-alt': {
    id: 'image-alt',
    title: 'Add alt text to image',
    description: 'Images must have alternative text that describes the content or function of the image.',
    beforeCode: '<img src="product.jpg">',
    afterCode: '<img src="product.jpg" alt="Blue running shoes">',
    explanation: 'Add an alt attribute that describes the image content. For decorative images, use alt="".',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content',
  },

  'color-contrast': {
    id: 'color-contrast',
    title: 'Improve color contrast',
    description: 'Text must have sufficient contrast against its background (4.5:1 for normal text, 3:1 for large text).',
    beforeCode: '.text { color: #999; background: #fff; }',
    afterCode: '.text { color: #595959; background: #fff; }',
    explanation: 'Increase the contrast ratio by using darker text colors or lighter backgrounds. Use a contrast checker tool.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum',
  },

  'link-name': {
    id: 'link-name',
    title: 'Add descriptive link text',
    description: 'Links must have discernible text that describes their destination or purpose.',
    beforeCode: '<a href="/more"><i class="icon-arrow"></i></a>',
    afterCode: '<a href="/more" aria-label="Read more about our services"><i class="icon-arrow"></i></a>',
    explanation: 'Add visible text or aria-label to describe where the link goes or what it does.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context',
  },

  'label': {
    id: 'label',
    title: 'Associate label with form input',
    description: 'Form inputs must have associated labels that describe their purpose.',
    beforeCode: '<input type="text" name="email" placeholder="Email">',
    afterCode: '<label for="email">Email address</label>\n<input type="text" id="email" name="email">',
    explanation: 'Use a <label> element with a matching "for" attribute, or wrap the input inside the label.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions',
  },

  'html-has-lang': {
    id: 'html-has-lang',
    title: 'Add language attribute to HTML',
    description: 'The <html> element must have a lang attribute to indicate the page language.',
    beforeCode: '<html>\n  <head>...</head>',
    afterCode: '<html lang="en">\n  <head>...</head>',
    explanation: 'Add a lang attribute with the appropriate language code (e.g., "en" for English).',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page',
  },

  'document-title': {
    id: 'document-title',
    title: 'Add descriptive page title',
    description: 'Every page must have a unique, descriptive title element.',
    beforeCode: '<head>\n  <meta charset="UTF-8">\n</head>',
    afterCode: '<head>\n  <meta charset="UTF-8">\n  <title>Home - AccessCheck</title>\n</head>',
    explanation: 'Add a <title> element inside <head> that describes the page content and context.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled',
  },

  'landmark-one-main': {
    id: 'landmark-one-main',
    title: 'Add main landmark',
    description: 'Page must contain exactly one main landmark for the primary content.',
    beforeCode: '<div class="content">\n  <h1>Welcome</h1>\n  <p>Content...</p>\n</div>',
    afterCode: '<main>\n  <h1>Welcome</h1>\n  <p>Content...</p>\n</main>',
    explanation: 'Wrap your main content in a <main> element. Use only one <main> per page.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks',
  },

  'heading-order': {
    id: 'heading-order',
    title: 'Fix heading hierarchy',
    description: 'Heading levels should increase by one (h1 → h2 → h3), not skip levels.',
    beforeCode: '<h1>Title</h1>\n<h3>Subsection</h3>',
    afterCode: '<h1>Title</h1>\n<h2>Subsection</h2>',
    explanation: 'Maintain proper heading order. Don\'t skip from h1 to h3. Use h2, then h3, etc.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
  },

  'list': {
    id: 'list',
    title: 'Use proper list markup',
    description: 'Lists must be properly marked up with <ul>, <ol>, or <dl> elements.',
    beforeCode: '<div>\n  <div>• Item 1</div>\n  <div>• Item 2</div>\n</div>',
    afterCode: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
    explanation: 'Use semantic list elements (<ul> or <ol>) instead of div elements with bullet characters.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
  },

  'aria-required-attr': {
    id: 'aria-required-attr',
    title: 'Add required ARIA attributes',
    description: 'ARIA roles must have all required attributes defined.',
    beforeCode: '<div role="checkbox"></div>',
    afterCode: '<div role="checkbox" aria-checked="false" tabindex="0"></div>',
    explanation: 'Add all required ARIA attributes for the role. Checkbox requires aria-checked.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },

  'aria-valid-attr-value': {
    id: 'aria-valid-attr-value',
    title: 'Fix ARIA attribute value',
    description: 'ARIA attributes must have valid values.',
    beforeCode: '<button aria-pressed="yes">Toggle</button>',
    afterCode: '<button aria-pressed="true">Toggle</button>',
    explanation: 'Use valid ARIA values. For aria-pressed, use "true", "false", or "mixed" instead of "yes".',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },

  'tabindex': {
    id: 'tabindex',
    title: 'Remove positive tabindex',
    description: 'Avoid using positive tabindex values as they disrupt the natural tab order.',
    beforeCode: '<div tabindex="1">Content</div>',
    afterCode: '<div tabindex="0">Content</div>',
    explanation: 'Use tabindex="0" to add elements to tab order, or tabindex="-1" to remove from tab order. Avoid positive values.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order',
  },

  'duplicate-id': {
    id: 'duplicate-id',
    title: 'Ensure unique ID attributes',
    description: 'ID attributes must be unique within the page.',
    beforeCode: '<div id="main">...</div>\n<div id="main">...</div>',
    afterCode: '<div id="main-header">...</div>\n<div id="main-content">...</div>',
    explanation: 'Give each element a unique ID. Duplicate IDs can break accessibility features and JavaScript.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing',
  },

  'input-button-name': {
    id: 'input-button-name',
    title: 'Add value to input button',
    description: 'Input buttons must have a descriptive value attribute.',
    beforeCode: '<input type="submit">',
    afterCode: '<input type="submit" value="Submit form">',
    explanation: 'Add a value attribute that describes the button action.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },

  'meta-viewport': {
    id: 'meta-viewport',
    title: 'Allow zoom in viewport',
    description: 'The viewport meta tag should not disable zoom or set maximum-scale.',
    beforeCode: '<meta name="viewport" content="width=device-width, user-scalable=no">',
    afterCode: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    explanation: 'Remove user-scalable=no and maximum-scale restrictions to allow users to zoom.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text',
  },

  'select-name': {
    id: 'select-name',
    title: 'Add label to select dropdown',
    description: 'Select elements must have an associated label.',
    beforeCode: '<select name="country">\n  <option>USA</option>\n</select>',
    afterCode: '<label for="country">Country</label>\n<select id="country" name="country">\n  <option>USA</option>\n</select>',
    explanation: 'Add a <label> element with a matching "for" attribute to identify the select purpose.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions',
  },

  'frame-title': {
    id: 'frame-title',
    title: 'Add title to iframe',
    description: 'Iframes must have a title attribute describing their content.',
    beforeCode: '<iframe src="video.html"></iframe>',
    afterCode: '<iframe src="video.html" title="Product demo video"></iframe>',
    explanation: 'Add a title attribute that describes the iframe content or purpose.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },

  'definition-list': {
    id: 'definition-list',
    title: 'Fix definition list structure',
    description: 'Definition lists must only contain dt and dd elements.',
    beforeCode: '<dl>\n  <div>\n    <dt>Term</dt>\n    <dd>Definition</dd>\n  </div>\n</dl>',
    afterCode: '<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>',
    explanation: 'Remove wrapper divs. Place <dt> and <dd> elements directly inside <dl>.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
  },

  'region': {
    id: 'region',
    title: 'Add label to region',
    description: 'Regions with ARIA role must have an accessible name.',
    beforeCode: '<div role="region">...</div>',
    afterCode: '<div role="region" aria-label="User comments">...</div>',
    explanation: 'Add aria-label or aria-labelledby to identify the region purpose.',
    wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },
};

// Get fix suggestion by violation ID
export function getFixSuggestion(violationId: string): FixSuggestion | null {
  return fixSuggestions[violationId] || null;
}

// Get all fix suggestions
export function getAllFixSuggestions(): FixSuggestion[] {
  return Object.values(fixSuggestions);
}
