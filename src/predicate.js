/*
 * Predicate
 * version: 1.0.2
 * author: David Hamilton
 * license: https://github.com/nova706/PreparedQueryOptions/blob/master/LICENSE.txt (MIT)
 * https://github.com/nova706/PreparedQueryOptions
 *
 */

(function () {
    /**
     * A predicate is used for the $filter operator in a query. Predicates can be joined to query
     * using a group of filters with the 'and' operator.
     *
     * This is a helper class for the PreparedQueryOptions class to assist in building complex
     * filter clauses.
     *
     * @class Predicate
     * @constructor
     * @param {String} property The property to filter by.
     * @param {String} (operator) The operator used to filter.
     * @param {String|Number|Boolean} (value) The value to match.
     */
    function Predicate(property, operator, value) {

        /**
         * The stored predicates if the predicate was create from a join.
         * @property joinedPredicates
         * @type Array
         * @default []
         */
        this.joinedPredicates = [];
        this.property = property;
        this.operator = operator;
        this.groupOperator = 'and';
        this.value = value;
        return this;
    }

    /**
     * Joins a provided set of predicates using the group operator and returns a new Predicate
     *
     * @method join
     * @param {Predicate[]} predicates Array of predicates to join.
     * @param {String} [groupOperator] The operator for the filter set ('and' 'or').
     * @return {Predicate} Predicate object.
     */
    Predicate.join = function (predicates, groupOperator) {
        if (predicates instanceof Array && predicates.length > 0) {
            var joinedPredicate = new Predicate();
            joinedPredicate.groupOperator = (groupOperator === 'or') ? 'or' : 'and';
            joinedPredicate.joinedPredicates = predicates;
            return joinedPredicate;
        }
        return null;
    };

    /**
     * Modifies an existing predicate setting the operator to 'eq' and the value to the input parameter
     *
     * @method equals
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.equals = function (value) {
        this.operator = 'eq';
        this.value = value;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'ne' and the value to the input parameter
     *
     * @method notEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.notEqualTo = function (value) {
        this.operator = 'ne';
        this.value = value;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'gt' and the value to the input parameter
     *
     * @method greaterThan
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.greaterThan = function (value) {
        this.operator = 'gt';
        this.value = value;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'ge' and the value to the input parameter
     *
     * @method greaterThanOrEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.greaterThanOrEqualTo = function (value) {
        this.operator = 'ge';
        this.value = value;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'lt' and the value to the input parameter
     *
     * @method lessThan
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.lessThan = function (value) {
        this.operator = 'lt';
        this.value = value;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'le' and the value to the input parameter
     *
     * @method lessThanOrEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     */
    Predicate.prototype.lessThanOrEqualTo = function (value) {
        this.operator = 'le';
        this.value = value;
        return this;
    };

    /**
     * Joins an existing predicate with additional predicates using the group operator
     *
     * @method join
     * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
     * @param {String} [groupOperator] The operator for the filter set ('and' 'or').
     * @return {Predicate} Predicate object.
     */
    Predicate.prototype.join = function (predicates, groupOperator) {
        var initialPredicate = new Predicate(this.property, this.operator, this.value);
        this.property = null;
        this.operator = null;
        this.value = null;
        this.groupOperator = (groupOperator === 'or') ? 'or' : 'and';

        if (predicates instanceof Predicate) {
            this.joinedPredicates = [initialPredicate, predicates];
        } else if (predicates instanceof Array && predicates.length > 0) {
            predicates.unshift(initialPredicate);
            this.joinedPredicates = predicates;
        }
        return this;
    };

    /**
     * Builds and returns a URL parameter string based on the predicate.
     *
     * @method parsePredicate
     * @returns {String}
     */
    Predicate.prototype.parsePredicate = function () {
        var urlString = '';

        if (this.property && this.operator && this.value !== null) {
            var value = (typeof this.value === 'string') ? "'" + this.value + "'" : this.value.toString();
            return this.property + " " + this.operator + " " + value;
        }

        if (this.joinedPredicates.length > 0) {
            var i;
            var predicate;
            var predicateString;
            for (i = 0; i < this.joinedPredicates.length; i++) {
                predicate = this.joinedPredicates[i];
                predicateString = predicate.parsePredicate();
                urlString += (i > 0) ? ' ' + this.groupOperator + ' ' + predicateString : predicateString;
            }
        }

        return urlString;
    };

    /*globals module, define*/
    if (typeof module !== 'undefined' && module.exports) {

        // Expose this class for node.js
        module.exports = Predicate;

    } else if (typeof define === 'function' && define.amd) {

        // Expose this class for requireJS
        define(function () {
            return Predicate;
        });

    } else {

        // Expose this class as a global variable
        this.Predicate = Predicate;
    }

}).call(this);