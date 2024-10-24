const aggregate = (data, indicatorInfo, aggregator) => {
  const aggregatorField = aggregator,
    numeratorID = indicatorInfo.numeratorID,
    denominatorID = indicatorInfo.denominatorID,
    numeratorID2 = indicatorInfo.numeratorID2,
    denominatorID2 = indicatorInfo.denominatorID2,
    changeType = indicatorInfo.changeType,
    type = indicatorInfo.type.toLowerCase(),
    numeratorValues = {},
    denominatorValues = {},
    numeratorValues2 = {},
    denominatorValues2 = {};

    const roundToSignificantDigits = (value, significantDigits = 5) => {
      if (value == null) return null;
    
      const strValue = value.toString();
      
      // Check if the number is less than 0 or has more than 15 characters (Excel limit)
      if (value < 0 || strValue.length > 5) {
        return parseFloat(value.toFixed(significantDigits)); // Apply rounding
      }
    
      return value; // Return the original value if no rounding is required
    };
  // numberOfTracts = {},
  // numberOfNulls = {},
  // numberOfTracts2 = {},
  // numberOfNulls2 = {};

  // data.forEach(tract => {
  //   // console.log(JSON.stringify(tract))
  //   const aggregatorId = tract[aggregatorField];
  //   const notNull = tract.Data[numeratorID]
  //     ? true
  //     : false;

  //   const notNull2 = tract.Data[numeratorID2]
  //     ? true
  //     : false;

  //   numberOfTracts[aggregatorId]
  //     ? notNull
  //       ? numberOfTracts[aggregatorId] = numberOfTracts[aggregatorId] + 1
  //       : numberOfNulls[aggregatorId] = numberOfNulls[aggregatorId] + 1
  //     : notNull
  //       ? numberOfTracts[aggregatorId] = 1
  //       : numberOfNulls[aggregatorId] = 1;

  //   numberOfTracts['All']
  //     ? notNull
  //       ? numberOfTracts['All'] = numberOfTracts['All'] + 1
  //       : numberOfNulls['All'] = numberOfNulls['All'] + 1
  //     : notNull
  //       ? numberOfTracts['All'] = 1
  //       : numberOfNulls['All'] = 1;

  //   if (changeType) {
  //     numberOfTracts2[aggregatorId]
  //     ? notNull2
  //       ? numberOfTracts2[aggregatorId] = numberOfTracts2[aggregatorId] + 1
  //       : numberOfNulls2[aggregatorId] = numberOfNulls2[aggregatorId] + 1
  //     : notNull2
  //       ? numberOfTracts2[aggregatorId] = 1
  //       : numberOfNulls2[aggregatorId] = 1;

  //     numberOfTracts2['All']
  //     ? notNull2
  //       ? numberOfTracts2['All'] = numberOfTracts2['All'] + 1
  //       : numberOfNulls2['All'] = numberOfNulls2['All'] + 1
  //     : notNull2
  //       ? numberOfTracts2['All'] = 1
  //       : numberOfNulls2['All'] = 1;
  //   }
  // });

  // console.log('make it?');

  data
    .filter(tract =>
      type !== 'sum'
        ? tract.Data[numeratorID] && tract.Data[denominatorID]
        : tract.Data[numeratorID]
    )
    .filter(tract =>
      changeType
        ? type !== 'sum'
          ? tract.Data[numeratorID2] && tract.Data[denominatorID2]
          : tract.Data[numeratorID2]
        : true
    )
    .forEach(tract => {
      // console.log(tract.Data[numeratorID]);
      // console.log(tract.Data[numeratorID2]);

      // tract => the individual subarea for each tract that the data is aggregated by;
      const aggregatorId = tract[aggregatorField];
      // const nullNumerator1 = tract.Data[numeratorID] === null;
      // const nullNumerator2 = tract.Data[numeratorID2] === null;

      denominatorValues[aggregatorId]
        ? (denominatorValues[aggregatorId] =
            denominatorValues[aggregatorId] + tract.Data[denominatorID])
        : (denominatorValues[aggregatorId] = tract.Data[denominatorID]);

      // console.log(nullHolder);

      denominatorValues['All']
        ? (denominatorValues['All'] = denominatorValues['All'] + tract.Data[denominatorID])
        : (denominatorValues['All'] = tract.Data[denominatorID]);

      if (changeType) {
        denominatorValues2[aggregatorId]
          ? (denominatorValues2[aggregatorId] =
              denominatorValues2[aggregatorId] + tract.Data[denominatorID2])
          : (denominatorValues2[aggregatorId] = tract.Data[denominatorID2]);

        denominatorValues2['All']
          ? (denominatorValues2['All'] = denominatorValues2['All'] + tract.Data[denominatorID2])
          : (denominatorValues2['All'] = tract.Data[denominatorID2]);
      }
    });

  data
    .filter(tract =>
      type !== 'sum'
        ? tract.Data[numeratorID] && tract.Data[denominatorID]
        : tract.Data[numeratorID]
    )
    .filter(tract =>
      changeType
        ? type !== 'sum'
          ? tract.Data[numeratorID2] && tract.Data[denominatorID2]
          : tract.Data[numeratorID2]
        : true
    )
    .forEach(tract => {
      const aggregatorId = tract[aggregatorField];

      const weightingFactor =
        type === 'weighted ratio' ? tract.Data[denominatorID] / denominatorValues[aggregatorId] : 1;

      const allWeightingFactor =
        type === 'weighted ratio' ? tract.Data[denominatorID] / denominatorValues['All'] : 1;

      const weightingFactor2 =
        type === 'weighted ratio' && changeType
          ? tract.Data[denominatorID2] / denominatorValues2[aggregatorId]
          : 1;

      const allWeightingFactor2 =
        type === 'weighted ratio' && changeType
          ? tract.Data[denominatorID2] / denominatorValues2['All']
          : 1;

      numeratorValues[aggregatorId]
        ? (numeratorValues[aggregatorId] =
            numeratorValues[aggregatorId] + tract.Data[numeratorID] * weightingFactor)
        : (numeratorValues[aggregatorId] = tract.Data[numeratorID] * weightingFactor);

      numeratorValues['All']
        ? (numeratorValues['All'] =
            numeratorValues['All'] + tract.Data[numeratorID] * allWeightingFactor)
        : (numeratorValues['All'] = tract.Data[numeratorID] * allWeightingFactor);

      if (changeType) {
        numeratorValues2[aggregatorId]
          ? (numeratorValues2[aggregatorId] =
              numeratorValues2[aggregatorId] + tract.Data[numeratorID2] * weightingFactor2)
          : (numeratorValues2[aggregatorId] = tract.Data[numeratorID2] * weightingFactor2);

        numeratorValues2['All']
          ? (numeratorValues2['All'] =
              numeratorValues2['All'] + tract.Data[numeratorID2] * allWeightingFactor2)
          : (numeratorValues2['All'] = tract.Data[numeratorID2] * allWeightingFactor2);
      }
    });

  const calcAggregation = () => {
    const numeratorArray = Object.entries(numeratorValues);
    const numeratorArray2 = changeType ? Object.entries(numeratorValues2) : [];
    const aggregatedDataObj = {};
    const aggregatedDataObj2 = {};

    type === 'average'
      ? numeratorArray.map(
          ([aggregator, numerator]) =>
            (aggregatedDataObj[aggregator] = numerator / denominatorValues[aggregator])
        )
      : type === 'sum'
      ? numeratorArray.map(([aggregator, numerator]) => (aggregatedDataObj[aggregator] = numerator))
      : type === 'percent' || type === 'ratio'
      ? numeratorArray.map(
          ([aggregator, numerator]) =>
            (aggregatedDataObj[aggregator] = numerator / denominatorValues[aggregator])
        )
      : type === 'weighted ratio'
      ? numeratorArray.map(([aggregator, numerator]) => (aggregatedDataObj[aggregator] = numerator))
      : console.log('No known calculation type define');

    if (changeType) {
      type === 'average'
        ? numeratorArray2.map(
            ([aggregator, numerator]) =>
              (aggregatedDataObj2[aggregator] = numerator / denominatorValues2[aggregator])
          )
        : type === 'sum'
        ? numeratorArray2.map(
            ([aggregator, numerator]) => (aggregatedDataObj2[aggregator] = numerator)
          )
        : type === 'percent' || type === 'ratio'
        ? numeratorArray2.map(
            ([aggregator, numerator]) =>
              (aggregatedDataObj2[aggregator] = numerator / denominatorValues2[aggregator])
          )
        : type === 'weighted ratio'
        ? numeratorArray2.map(
            ([aggregator, numerator]) => (aggregatedDataObj2[aggregator] = numerator)
          )
        : console.log('No known calculation type define');

      changeType === 'Percent Change'
        ? Object.entries(aggregatedDataObj2).forEach(([key, value]) =>
            aggregatedDataObj[key] && value && aggregatedDataObj[key] !== 0 && value !== 0
              ? (aggregatedDataObj[key] = (aggregatedDataObj[key] - value) / value)
              : (aggregatedDataObj[key] = null)
          )
        : changeType === 'Change in Percent'
        ? Object.entries(aggregatedDataObj2).forEach(([key, value]) =>
            aggregatedDataObj[key] && value
              ? (aggregatedDataObj[key] = 100 * (aggregatedDataObj[key] - value))
              : (aggregatedDataObj[key] = null)
          )
        : Object.entries(aggregatedDataObj2).forEach(([key, value]) =>
            aggregatedDataObj[key] && value
              ? (aggregatedDataObj[key] = aggregatedDataObj[key] - value)
              : (aggregatedDataObj[key] = null)
          );
    }

    Object.keys(aggregatedDataObj).forEach((key) => {
      aggregatedDataObj[key] = roundToSignificantDigits(aggregatedDataObj[key], significantDigits);
    });


    // console.log(aggregatedDataObj2);
    // console.log({ aggregatedDataObj });
    return aggregatedDataObj;
  };

  return calcAggregation();
};

module.exports = aggregate;
