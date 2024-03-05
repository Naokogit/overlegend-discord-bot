const { issueInput } = require("../modules/modalInputModule");
const { ticketCategories } = require("../configs/tickets_category.json");

var subcategories = []
for (const category of Object.keys(ticketCategories)) {
    if(ticketCategories[category].subcategory){
        subcategories[category] = [];
        ticketCategories[category].subcategory.forEach(cat => {
            subcategories[category].push("btnSubCategory_" + cat.id);
        });
    }
}

function isSubcategory(id) {
    for (const category of Object.keys(subcategories)) {
        if (subcategories[category].includes(id)) {
            return { found: true, category: category };
        }
    }
    return { found: false, category: null };
}

module.exports = {subcategories, isSubcategory};