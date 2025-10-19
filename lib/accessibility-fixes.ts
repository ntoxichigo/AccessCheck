/**
 * Accessibility Fix Code Snippets Generator
 * Provides actionable code examples for common WCAG violations
 */

export interface FixSuggestion {
  title: string;
  description: string;
  codeSnippets: CodeSnippet[];
}

export interface CodeSnippet {
  language: 'html' | 'css' | 'jsx' | 'javascript';
  label: string;
  code: string;
}

/**
 * Generate fix suggestions based on violation ID/help text
 */
export function getFixSuggestions(violationId: string, help: string): FixSuggestion | null {
  const helpLower = help.toLowerCase();
  const idLower = violationId.toLowerCase();

  // Color contrast issues
  if (helpLower.includes('color contrast') || idLower.includes('color-contrast')) {
    return {
      title: 'Fix Color Contrast',
      description: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)',
      codeSnippets: [
        {
          language: 'css',
          label: 'Increase contrast with darker text',
          code: `/* Before: Low contrast */
.text {
  color: #999; /* Light gray on white */
}

/* After: High contrast (meets WCAG AA) */
.text {
  color: #333; /* Dark gray on white - 12.6:1 ratio */
}`
        },
        {
          language: 'css',
          label: 'Alternative: Use darker background',
          code: `/* Inverted high-contrast theme */
.dark-section {
  background-color: #1a1a1a; /* Dark background */
  color: #ffffff; /* White text - 19:1 ratio */
}`
        }
      ]
    };
  }

  // Image alt text
  if (helpLower.includes('image') && (helpLower.includes('alt') || helpLower.includes('alternative'))) {
    return {
      title: 'Add Alternative Text to Images',
      description: 'All images must have descriptive alt text for screen readers',
      codeSnippets: [
        {
          language: 'html',
          label: 'Informative image',
          code: `<!-- Before: Missing alt text -->
<img src="chart.png">

<!-- After: Descriptive alt text -->
<img src="chart.png" alt="Bar chart showing 40% increase in sales for Q4 2024">`
        },
        {
          language: 'html',
          label: 'Decorative image',
          code: `<!-- For decorative images, use empty alt -->
<img src="decorative-border.png" alt="" role="presentation">`
        },
        {
          language: 'jsx',
          label: 'React/Next.js Image',
          code: `import Image from 'next/image';

<Image 
  src="/product.jpg" 
  alt="Blue wireless headphones with noise cancellation"
  width={300}
  height={200}
/>`
        }
      ]
    };
  }

  // Form labels
  if (helpLower.includes('form') && (helpLower.includes('label') || helpLower.includes('input'))) {
    return {
      title: 'Add Labels to Form Inputs',
      description: 'Every form input must have an associated label for screen readers',
      codeSnippets: [
        {
          language: 'html',
          label: 'Explicit label association',
          code: `<!-- Before: No label -->
<input type="text" name="email">

<!-- After: Properly labeled -->
<label for="email-input">Email Address</label>
<input type="text" id="email-input" name="email">`
        },
        {
          language: 'html',
          label: 'Implicit label (wrapped)',
          code: `<label>
  Phone Number
  <input type="tel" name="phone">
</label>`
        },
        {
          language: 'jsx',
          label: 'React form with accessible labels',
          code: `<div className="form-group">
  <label htmlFor="username" className="form-label">
    Username
  </label>
  <input 
    type="text" 
    id="username"
    name="username"
    aria-required="true"
    className="form-input"
  />
</div>`
        }
      ]
    };
  }

  // Heading structure
  if (helpLower.includes('heading') && (helpLower.includes('order') || helpLower.includes('level'))) {
    return {
      title: 'Fix Heading Hierarchy',
      description: 'Headings must be in logical order (h1 → h2 → h3) without skipping levels',
      codeSnippets: [
        {
          language: 'html',
          label: 'Correct heading structure',
          code: `<!-- Before: Skipped h2 -->
<h1>Page Title</h1>
<h3>Subsection</h3>

<!-- After: Logical hierarchy -->
<h1>Page Title</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>`
        },
        {
          language: 'css',
          label: 'Style headings without changing semantic level',
          code: `/* Use CSS to style, not wrong heading level */
h2.small-heading {
  font-size: 1rem; /* Same visual size as h4 */
  font-weight: 600;
}

/* Don't use h4 just for styling when h2 is semantically correct */`
        }
      ]
    };
  }

  // ARIA labels
  if (helpLower.includes('aria') || helpLower.includes('accessible name')) {
    return {
      title: 'Add ARIA Labels',
      description: 'Interactive elements need accessible names for screen readers',
      codeSnippets: [
        {
          language: 'html',
          label: 'Button with aria-label',
          code: `<!-- Before: Icon button without label -->
<button>
  <svg>...</svg>
</button>

<!-- After: Accessible button -->
<button aria-label="Close menu">
  <svg aria-hidden="true">...</svg>
</button>`
        },
        {
          language: 'html',
          label: 'Link with aria-label',
          code: `<!-- For "Read more" links, be specific -->
<a href="/article" aria-label="Read more about accessibility testing">
  Read more
</a>`
        },
        {
          language: 'jsx',
          label: 'React icon button',
          code: `import { X } from 'lucide-react';

<button 
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X aria-hidden="true" />
</button>`
        }
      ]
    };
  }

  // Keyboard navigation
  if (helpLower.includes('keyboard') || helpLower.includes('focus')) {
    return {
      title: 'Enable Keyboard Navigation',
      description: 'All interactive elements must be keyboard accessible',
      codeSnippets: [
        {
          language: 'html',
          label: 'Make div clickable with proper semantics',
          code: `<!-- Before: Non-accessible div -->
<div onclick="handleClick()">Click me</div>

<!-- After: Use button element -->
<button onclick="handleClick()">Click me</button>

<!-- Or add keyboard support to div -->
<div 
  role="button" 
  tabindex="0"
  onclick="handleClick()"
  onkeydown="if(event.key==='Enter'||event.key===' ') handleClick()"
>
  Click me
</div>`
        },
        {
          language: 'css',
          label: 'Visible focus indicators',
          code: `/* Ensure focus is visible */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Never remove focus outlines without replacement */
button:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 3px;
}`
        }
      ]
    };
  }

  // Link purpose
  if (helpLower.includes('link') && (helpLower.includes('purpose') || helpLower.includes('name'))) {
    return {
      title: 'Provide Descriptive Link Text',
      description: 'Links should clearly describe their destination',
      codeSnippets: [
        {
          language: 'html',
          label: 'Descriptive link text',
          code: `<!-- Before: Generic link text -->
<a href="/docs">Click here</a>

<!-- After: Descriptive link text -->
<a href="/docs">Read the accessibility documentation</a>`
        },
        {
          language: 'html',
          label: 'Link with additional context',
          code: `<!-- Use aria-label for additional context -->
<a href="/report.pdf" aria-label="Download Q4 2024 accessibility report (PDF, 2.3 MB)">
  Download Report
</a>`
        }
      ]
    };
  }

  // Landmark regions
  if (helpLower.includes('landmark') || helpLower.includes('region')) {
    return {
      title: 'Add Landmark Regions',
      description: 'Use semantic HTML5 elements to define page regions',
      codeSnippets: [
        {
          language: 'html',
          label: 'Semantic HTML5 structure',
          code: `<!-- Use semantic elements instead of divs -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation links -->
  </nav>
</header>

<main>
  <article>
    <!-- Main content -->
  </article>
  
  <aside>
    <!-- Sidebar content -->
  </aside>
</main>

<footer>
  <!-- Footer content -->
</footer>`
        },
        {
          language: 'html',
          label: 'ARIA landmarks for custom layouts',
          code: `<!-- When you can't use semantic HTML -->
<div role="banner">Header content</div>
<div role="navigation" aria-label="Site navigation">Nav</div>
<div role="main">Main content</div>
<div role="complementary">Sidebar</div>
<div role="contentinfo">Footer</div>`
        }
      ]
    };
  }

  // Generic fallback
  return {
    title: 'Fix Accessibility Issue',
    description: 'Review the violation and apply WCAG guidelines',
    codeSnippets: [
      {
        language: 'html',
        label: 'General best practices',
        code: `<!-- Accessibility checklist -->
<!-- ✓ Use semantic HTML elements -->
<!-- ✓ Provide text alternatives for non-text content -->
<!-- ✓ Ensure sufficient color contrast -->
<!-- ✓ Make all functionality keyboard accessible -->
<!-- ✓ Use ARIA labels when needed -->
<!-- ✓ Test with screen readers -->`
      }
    ]
  };
}

/**
 * Get a quick fix action for common issues
 */
export function getQuickFix(violationId: string): string {
  const idLower = violationId.toLowerCase();
  
  if (idLower.includes('color-contrast')) {
    return 'Use darker text colors or lighter backgrounds to meet 4.5:1 contrast ratio';
  }
  if (idLower.includes('image-alt')) {
    return 'Add alt="description" attribute to all <img> tags';
  }
  if (idLower.includes('label')) {
    return 'Add <label> elements with for attribute matching input id';
  }
  if (idLower.includes('heading')) {
    return 'Use headings in logical order: h1 → h2 → h3 (no skipping)';
  }
  if (idLower.includes('aria')) {
    return 'Add aria-label or aria-labelledby to describe the element';
  }
  if (idLower.includes('button-name') || idLower.includes('link-name')) {
    return 'Add descriptive text or aria-label to buttons and links';
  }
  
  return 'Review WCAG guidelines and update the element';
}
