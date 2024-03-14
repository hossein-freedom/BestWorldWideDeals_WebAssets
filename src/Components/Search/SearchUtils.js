export const prepareSearchFilter = (searchType, searchValue, selectedCategories, selectedSubCategories, toPrice, fromPrice, selectedResources, 
                                    adminFilters) => {
    var textFilters = [];
    if(searchValue.length > 0 ){
        if(searchType == "exact"){
            textFilters = [
                            {
                                fieldName: "title",
                                fieldValue: `${searchValue}`,
                                isNegate: false,
                                operator: "EQUAL"
                            },
                            {
                                fieldName: "title",
                                fieldValue: `%${searchValue}`,
                                isNegate: false,
                                operator: "LIKE"
                            },
                            {
                                fieldName: "title",
                                fieldValue: `${searchValue}%`,
                                isNegate: false,
                                operator: "LIKE"
                            },
                            {
                                fieldName: "title",
                                fieldValue: `%${searchValue}%`,
                                isNegate: false,
                                operator: "LIKE"
                            },
                        ];
            }else{
                const tokens = tokenizeSearchText(searchValue);
                tokens.forEach(token=>{
                    textFilters.push({
                        fieldName: "title",
                        fieldValue: `${token}`,
                        isNegate: false,
                        operator: "EQUAL"
                    });
                    textFilters.push({
                        fieldName: "title",
                        fieldValue: `%${token}`,
                        isNegate: false,
                        operator: "LIKE"
                    });
                    textFilters.push({
                        fieldName: "title",
                        fieldValue: `${token}%`,
                        isNegate: false,
                        operator: "LIKE"
                    });
                    textFilters.push({
                        fieldName: "title",
                        fieldValue: `%${token}%`,
                        isNegate: false,
                        operator: "LIKE"
                    });
                });
            }
        }
        const extraFilters = [];
        if(selectedCategories.length>0){ 
            var categoriesFilter = {
                fieldName: "category",
                fieldValue: selectedCategories,
                isNegate: false,
                operator: "IN"
            };
            extraFilters.push(categoriesFilter);
        }
        if( Object.values(selectedSubCategories).length > 0){
            const subCategoriesList = new Set();
            Object.values(selectedSubCategories).forEach( subCategories => 
                subCategories.forEach(subCategory=> {
                    subCategoriesList.add(subCategory)
                })
            );
            var subCategoriesFilter = {
                fieldName: "subCategory",
                fieldValue: [...subCategoriesList],
                isNegate: false,
                operator: "IN"
            };
            extraFilters.push(subCategoriesFilter);
        }
        if(selectedResources.length>0){
            var resourcesFilter = {
                fieldName: "source",
                fieldValue: selectedResources,
                isNegate: false,
                operator: "IN"
            };
            extraFilters.push(resourcesFilter);
        }
        var fromPriceFilter = {
            fieldName: "price",
            fieldValue: fromPrice,
            isNegate: false,
            operator: "GE"
        };
        var toPriceFilter = {
            fieldName: "price",
            fieldValue: toPrice,
            isNegate: false,
            operator: "LE"
        };
       
        extraFilters.push(fromPriceFilter);
        extraFilters.push(toPriceFilter);

        //Admin Filters    
        if (adminFilters){
            if(adminFilters["activationFilter"] && adminFilters["activationFilter"] > 0){
                var activationFilter = {
                    fieldName: "isActive",
                    fieldValue: adminFilters["activationFilter"] === 1 ? true : false,
                    isNegate: false,
                    operator: "EQUAL"
                };
                extraFilters.push(activationFilter);
            }
            if(adminFilters["saleFilter"] && adminFilters["saleFilter"] === true){
                var isOnSaleActivation = {
                    fieldName: "isOnSale",
                    fieldValue: true,
                    isNegate: false,
                    operator: "EQUAL"
                };
                extraFilters.push(isOnSaleActivation);
            }
            if(adminFilters["expiryFilter"] && adminFilters["expiryFilter"] > 0){
                const now = new Date()  
                const milllisecondsSinceEpoch = now.getTime()  

                var expiryActivation = {
                    fieldName: "endDate",
                    fieldValue: milllisecondsSinceEpoch,
                    isNegate: false,
                    operator: adminFilters["expiryFilter"] === 1 ? "LE" : "GE"
                };
                extraFilters.push(expiryActivation);
            }
        }

        var textSearchObj = {
            filters: textFilters,
            operand: "OR"
        };

        var extraSearchObj = {
            filters: extraFilters,
            operand: "AND"
        };

        return  {
                    page: {
                        pageNumber: 0,
                        pageSize: 500
                    },
                    predicateNode: {
                        leftFilterNode: textSearchObj,
                        operand: "AND",
                        rightFilterNode: extraSearchObj,
                    },
                    searchType:"FILTERED",
                    sort: {
                        fieldName: "title",
                        isAsc: true
                    }
                };
};


export const prepareSearchFilterForAll = () => {
    return  {
        page: {
            pageNumber: 0,
            pageSize: 500
        },
        predicateNode: {
            leftFilterNode: {},
            operand: "AND",
            rightFilterNode: {},
        },
        searchType:"ALL",
        sort: {
            fieldName: "title",
            isAsc: true
        }
    };
}


const tokenizeSearchText = (searchValue) => {
    const tokens = searchValue.split(" ");
    const result = [];
    for(let i=0;i<tokens.length;i++){
        if(tokens[i].length==0){
            continue;
        }
        let str = tokens[i];
        result.push(str);
        for(let j=i+1;j<tokens.length;j++){
            if(tokens[j].length==0){
                str += " ";
            }else{
                if(tokens[j-1].length>0){
                    str+=" ";
                }
                str += tokens[j];
            }
            if(tokens[j].length==0){
                continue;
            }
            result.push(str);
        }
        if(i==tokens.length-1 && !result.includes(tokens[i])){
            result.push(tokens[i]);
        }
    }
    return result;
};