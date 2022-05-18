const filteredResults = (model) => async (req, res, next) => {
  let config = {};

  if (req.query.select) {
    let select = req.query.select
      .split(",")
      .filter((item) => !item.includes("."));

    config.attributes = select;
  }

  if (req.query.sort) {
    const sortBy = req.query.sort;
    let fieldName;
    let order;
    if (sortBy[0] == "-") {
      fieldName = sortBy.substring(1);
      order = "ASC";
    } else {
      fieldName = sortBy;
      order = "DESC";
    }
    config.order = [[fieldName, order]];
  }

  // Limit Results
  if (req.query.limit) {
    config.limit = parseInt(req.query.limit);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.count();

  config.limit = limit;
  config.offset = startIndex;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  req.filters = {
    pagination,
    config,
  };

  next();
};

export default filteredResults;
