module.exports = function(eleventyConfig) {
  
  // Add date filter for sitemap
  eleventyConfig.addFilter("dateToRfc3339", function(dateObj) {
    return new Date(dateObj).toISOString();
  });
  
  // ISO date for schema JSON-LD
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0] + "T00:00:00+00:00";
  });
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");
   
  // Watch for changes in CSS/JS
  eleventyConfig.addWatchTarget("assets/css/");
  eleventyConfig.addWatchTarget("assets/js/");
  
  // Add affiliate link shortcode
  eleventyConfig.addShortcode("affiliateLink", function(productId, linkText = "Check current pricing and availability") {
    const products = require('./_data/products.json');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return `[Product not found: ${productId}]`;
    }
    
    return `<a href="${product.affiliate_link}" target="_blank" rel="noopener nofollow sponsored" class="affiliate-link">${linkText}</a> <span class="affiliate-disclosure">(affiliate link - we earn commission at no extra cost to you)</span>`;
  });
  
  // Add product card shortcode
  eleventyConfig.addShortcode("productCard", function(productId) {
    const products = require('./_data/products.json');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return `[Product not found: ${productId}]`;
    }
    
    return `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p>${product.short_description}</p>
        <div class="product-meta">
          <span class="price">$${product.price}</span>
          <span class="commission">${product.commission_pct}% commission</span>
        </div>
        <a href="${product.review_url}" class="btn-primary">Read Full Review</a>
        <a href="${product.affiliate_link}" target="_blank" rel="noopener nofollow sponsored" class="btn-secondary">Check Availability</a>
      </div>
    `;
  });
  
  // Add collection for reviews by category
  eleventyConfig.addCollection("powerReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/power/*.md");
  });
  
  eleventyConfig.addCollection("fishingReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/fishing/*.md");
  });
  
  eleventyConfig.addCollection("campingReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/camping/*.md");
  });
  
   eleventyConfig.addCollection("waterReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/water/*.md");
  });

   eleventyConfig.addCollection("tentReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/tents/*.md");
  });

  eleventyConfig.addCollection("backpackReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/backpacks/*.md")
      .filter(item => !item.inputPath.includes("index.md"));
  });
  
  // Add collection for all reviews
  eleventyConfig.addCollection("allReviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/**/*.md");
  });
  
  eleventyConfig.addCollection("clothingReviews", function(collectionApi) {
     return collectionApi.getFilteredByGlob("content/reviews/clothing/*.md")
     .filter(item => item.inputPath.split('/').pop() !== 'index.md');
});
  
  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "../_includes",
      data: "../_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
