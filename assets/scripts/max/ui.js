'use strict'

const common = require('../commonUI.js')
const store = require('../store')
const showMaxesTemplate = require('../templates/max-table.handlebars')

const showNewMax = function () {
    $('#new-max-modal').modal('show')
    $('#new-max-date').attr('value', parseDateForDefault(new Date()))
}

const newMaxSuccess = function(data) {
    $('.display-message').text('New Max Submit Success!')
    $('.display-message').css('color', 'green')
    common.fadeAndClearDisplayMessage()
    common.resetForms()
    $('#new-max-date').attr('value', parseDateForDefault(new Date()))
    // redraw table if the table is currently visible
    if (store.maxes) {
        store.maxes.push(data.max)
        store.maxes.sort((maxA, maxB) => new Date(maxA.date) - new Date(maxB.date))
        // sessionStorage.setItem("maxes", JSON.stringify(store.maxes))
    }
    if ($('.table-container').css("display") === "block") {
        redrawMaxTableAfterEdit()
        // common.populateTableDropdown(store.maxes)
    }
    $('#new-max-multiple-entry').is(':checked') ? '' : $('#new-max-modal').modal('hide')
}

const showMaxesSuccess = function(data) {
    store.maxes = data.maxes
    store.maxes.sort((maxA, maxB) => new Date(maxA.date) - new Date(maxB.date))
    // sessionStorage.setItem("maxes", JSON.stringify(store.maxes))
    $('.maxes-table').html('')
    $('.table-container').show()
    $('.chart-container').hide()
    $('.bodyweight-container').hide()
    $('.max-container').show()
    $('.about-message').hide()
    $('.max-dropdown').hide()
    // common.populateTableDropdown(store.maxes)
    let showMaxesHtml = ''
    store.maxes.length > 0 ? showMaxesHtml = showMaxesTemplate({ maxes: store.maxes }) : drawEmptyTable()
    $('.maxes-table').append(showMaxesHtml)
}

const drawEmptyTable = function () {
    $('.maxes-table').append('You have no 1RM entered yet!')
}

const showEditMax = function () {
    $('#edit-max-modal').modal('show')
    $('#edit-max-date').attr('value', store.maxes[store.maxesLocation].date.slice(0, 10))
    $('#edit-max-squat').attr('value', store.maxes[store.maxesLocation].squat1RM)
    $('#edit-max-bench').attr('value', store.maxes[store.maxesLocation].bench1RM)
    $('#edit-max-deadlift').attr('value', store.maxes[store.maxesLocation].deadlift1RM)
    $('#edit-max-press').attr('value', store.maxes[store.maxesLocation].press1RM)
}

const redrawMaxTableAfterEdit = function () {
    ($('.table-container').css("display") === "block") ? showMaxesSuccess(store) : ''
    $('#edit-max-modal').modal('hide')
    common.resetForms()
}

const editMaxSuccess = function (data) {
    store.maxes[store.maxesLocation] = data.max
    redrawMaxTableAfterEdit()
    // sessionStorage.setItem("maxes", JSON.stringify(store.maxes))
}

const deleteMaxSuccess = function () {
    store.maxes.splice(store.maxesLocation, 1)
    redrawMaxTableAfterEdit()
    // common.populateTableDropdown(store.maxes)
    // sessionStorage.setItem("maxes", JSON.stringify(store.maxes))
}

const parseDateForDefault = function (dateObject) {
    const date = dateObject.toDateString()
    const monthString = date.slice(4, 7)
    let month = '01'
    switch (monthString) {
        case 'Jan':
            month = '01'
            break
        case 'Feb':
            month = '02'
            break
        case 'Mar':
            month = '03'
            break
        case 'Apr':
            month = '04'
            break
        case 'May':
            month = '05'
            break
        case 'Jun':
            month = '06'
            break
        case 'Jul':
            month = '07'
            break
        case 'Aug':
            month = '08'
            break
        case 'Sep':
            month = '09'
            break
        case 'Oct':
            month = '10'
            break
        case 'Nov':
            month = '11'
            break
        case 'Dec':
            month = '12'
            break
        default:
            month = "Something's gone horribly wrong. There are only 12 months."
    }
    let parsedDate = ''
    parsedDate += date.slice(11, 15) + '-' + month + '-' + date.slice(8, 10)
    return parsedDate
}

const failure = function() {
    $('.display-message').text('Max API Call Failed!')
    $('.display-message').css('color', 'red')
    common.fadeAndClearDisplayMessage()
}

module.exports = {
    newMaxSuccess,
    failure,
    showMaxesSuccess,
    editMaxSuccess,
    showEditMax,
    deleteMaxSuccess,
    showNewMax
}