/*global h5, hifive, window, document */
/*
 * Copyright (C) 2015 NS Solutions Corporation, All Rights Reserved.
 */
(function() {
	'use strict';

	/**
	 * @class hifive.pitalium.explorer.newList.PageController
	 */
	/**
	 * @lends hifive.pitalium.explorer.newList.PageController#
	 */
	var PageController = {
		/**
		 * @ignore
		 */
		__name: 'hifive.pitalium.explorer.controller.ResultListPageController',
		/**
		 * @ignore
		 */
		__templates: 'src/new_list/new_list.ejs',

		/**
		 * The &quot;logic&quot; class
		 * 
		 * @type {hifive.pitalium.explorer.newList.PageLogic}
		 */
		_testResultListLogic: hifive.pitalium.explorer.logic.TestResultListLogic,

		/**
		 * @type {JQuery}
		 */
		_$root: null,
		/**
		 * @type {JQuery}
		 */
		_$navBar: null,
		/**
		 * @type {JQuery}
		 */
		_$backgroundPattern: null,

		/**
		 * The number of items to show in one page.
		 * 
		 * @type Number
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 */
		_pageSize: 20,

		/**
		 * The 0-based index of the item at the top of the current page.
		 * 
		 * @type Number
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 */
		_pageStart: 0,

		/**
		 * Called after the controller has been initialized.<br>
		 * Load list of test execution time asynchronously and update views.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 */
		__ready: function() {
			this._$root = $(this.rootElement);
			this._$navBar = this.$find('.navbar');
			this._$backgroundPattern = this.$find('.background-pattern');

			this.collectSearchParameters();
			this.onHashChange();
			$(window).on('hashchange', this.own(this.onHashChange));
		},

		/**
		 * Called when a label of test execution has been clicked.<br>
		 * Load list of test results of selected item asynchronously, and update views.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 * @param {Object} context the event context
		 * @param {jQuery} $el the event target element
		 */
		'.appendTable click': function(context, $el) {
			var testExecutionId = $el.data('testExecutionId');

			var $table_list = this.$find("#table_list_" + testExecutionId);
			var $resultContent = $table_list.closest('.result_content');
			$table_list.slideToggle({
				complete: this.own(function() {
					this._updateResultContentHeight($resultContent);
				})
			});

			// Check the loaded flag and do nothing if exists.
			if ($table_list.hasClass('hifive.pitalium.explorer-load')) {
				return;
			}

			$table_list.addClass('hifive.pitalium.explorer-load');

			// Show indicator
			var indicator = this.indicator({
				message: 'Loading...',
				target: document
			}).show();

			//to get screenshots list from API
			this._testResultListLogic.getScreenshotList(testExecutionId).done(
					this.own(function(data) {
						this.view.update("#result_ul_" + testExecutionId, "screenshot_list", {
							screenshots: data
						});
					})).always(function() {
				indicator.hide();
				;
			});
		},

		'{window} scroll': function() {
			var height = this._$root.scrollTop();
			if (height > 80) {
				this._$navBar.fadeIn();
			} else {
				this._$navBar.fadeOut();
			}

			if (height < 86) {
				this._$backgroundPattern.fadeIn();
			} else {
				this._$backgroundPattern.fadeOut();
			}
		},

		'.expected click': function(context, $el) {
			var directory = $el.data("directory");
			var target = $el.val();

			this.$find(".btn-run").hide();
			this.$find(".expected").show();

			this._findInput(2, directory, target).show(); // To show 'Run-button' in expected element's row

			this.$find(".compare").show();
			var this_checkbox = this._findInput(1, directory, target); //To find and hide [expected element's campare checkbox]
			var all_checkbox = this._findInput(1, directory); //To find [compare elements checkboxes]

			all_checkbox.show();//To show [compare elements checkboxes]

			all_checkbox.prop("checked", true);

			this_checkbox.hide(); //To hide [expected element's campare checkbox]
			this_checkbox.removeAttr("checked");
		},

		'.btn-run click': function(context, $el) {
			$el.hide();

			var loading = $el.parent().find("img");
			loading.show(); //loading-circle gif image show

			var targets = this.$find(".compare:checked").map(function() {
				var $this = $(this);
				return $this.data("directory") + "/" + $this.data("target");
			}).get();

			var directory_expected = $el.data("directory");
			var expected = $el.data("target");
			this._testResultListLogic.compareScreenshots(targets.join(','),
					directory_expected + "/" + expected).done(this.own(function() {
				this._appendComparisonResult(directory_expected, $el.data("id"));
				loading.hide();
				$el.show();
			}));
		},

		'.result_info click': function(context, $el) {
			var info_table = $el.parent().find(".info_table_div");
			var $resultContent = $el.closest('.result_content');
			info_table.slideToggle({
				complete: this.own(function() {
					this._updateResultContentHeight($resultContent);
				})
			});

			var modeToggleButtons = $resultContent.find('.mode-toggle-buttons');

			var result_icon = $el.parent().find(".result_icon");

			if (info_table.data("hided") == "true") {
				info_table.data("hided", "false");
				result_icon.addClass("glyphicon-menu-right");
				result_icon.removeClass("glyphicon-menu-down");
				modeToggleButtons.hide();
			} else {
				info_table.data("hided", "true");
				result_icon.addClass("glyphicon-menu-down");
				result_icon.removeClass("glyphicon-menu-right");
				modeToggleButtons.show();
			}
		},

		'.toggle-mode click': function(context, $el) {
			context.event.stopPropagation();
			var $resultInfoContainer = $el.closest('.result_info_container');
			var $resultCol = $resultInfoContainer.find('.result_mode');
			var $compareCol = $resultInfoContainer.find('.compare_mode');

			var mode = $el.data('mode');
			if (mode == 'result') {
				$resultCol.show();
				$compareCol.hide();
			} else if (mode == 'compare') {
				$resultCol.hide();
				$compareCol.show();
			}
		},

		'.delete-btn click': function(context, $el) {
			var directory = $el.data("directory");
			var id = $el.data("resultid");

			this.$find("#result_info_" + id).remove();
			alert("Results deleted!");

			this._testResultListLogic.deleteScreenshot(directory, id);
		},

		_findInput: function(type, directory, target) {

			//if type == 0, this function return the radio buttons in the expected-row
			//if type == 1, this function return the checkboxes in the compare-row
			//if type == 2, this function return the [Run] button in the selected column

			if (target == null) {
				switch (parseInt(type)) {
				case 0:
					return this._$root
							.find("input[type=radio][data-directory='" + directory + "']");
				case 1:
					return this._$root.find("input[type=checkbox][data-directory='" + directory
							+ "']");
				case 2:
					return this._$root.find("a[data-directory='" + directory + "']");
				}
			}

			switch (parseInt(type)) {
			case 0:
				return this._$root.find("input[type=radio][data-directory='" + directory
						+ "'][data-target='" + target + "']");
			case 1:
				return this._$root.find("input[type=checkbox][data-directory='" + directory
						+ "'][data-target='" + target + "']");
			case 2:
				return this._$root.find("a[data-directory='" + directory + "'][data-target='"
						+ target + "']");
			}
		},

		_updateResultContentHeight: function($resultContent) {
			$resultContent.css('height', '');
			var height = $resultContent.height();
			$resultContent.find('.result_info_container').each(function() {
				height += this.offsetHeight;
			});
			$resultContent.height(height);
		},

		_appendComparisonResult: function(path, id) {
			this._testResultListLogic.fetchScreenshotList(path, true).done(this.own(function(data) {
				var resultList = data.resultList;
				for (var i = 0; i < resultList.length; i++) {
					var result = resultList[i];
					var tStamp = new Date(parseInt(result.executionTime));

					this.$find("#result_h_" + id).show();
					this.view.append('#result_ul_' + id, "result_info_table", {
						id: result.id,
						resultList: result.resultList,
						expected: result.expectedFilename,
						timestamp: hifive.pitalium.explorer.utils.toLocaleTimeString(tStamp),
						directory: path
					});
				}
			}));
		},

		/**
		 * Called when the page link has been clicked. Update view.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 */
		onHashChange: function() {
			var pageStart = Math.max(0, parseInt(window.location.hash.substr(1), 10));
			if (isNaN(pageStart)) {
				pageStart = 0;
			}
			this._pageStart = pageStart;

			this.updatePage();
		},

		/**
		 * Collect search keyword parameters and save them to logic.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 * @param {jQuery} $el the search element
		 */
		collectSearchParameters: function($el) {
			if (typeof ($el) == 'undefined') {
				$el = this.$find('#searchTest');
			}

			var params = {};
			$el.find('input').each(function(index) {
				var $elem = $(this);
				params[$elem.attr('name')] = $elem.val();
			});

			this._testResultListLogic.searchTestMethod = params.searchTestMethod;
			this._testResultListLogic.searchTestScreen = params.searchTestScreen;
		},

		/**
		 * Set pageSize and pageStart, and update view.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 */
		updatePage: function() {
			var page = 1 + Math.floor(this._pageStart / this._pageSize);
			this.loadTestExecutionList(page);
		},

		/**
		 * Load test execution list from server and update view.
		 * 
		 * @memberOf hifive.pitalium.explorer.controller.ResultListPageController
		 * @param {number} page desired page number
		 */
		loadTestExecutionList: function(page) {
			var indicator = this.indicator({
				message: 'Loading...',
				target: document
			}).show();

			// Load list of test execution
			this._testResultListLogic.getTestExecutionList(page, this._pageSize).done(
			// this._testResultListLogic.fetchList().done(
			this.own(function(response) {
				// Update views
				this.view.update('#result_list', 'testExecutionListTemplate', {
					contents: response.content
				});
			})).always(function() {
				indicator.hide();
			});
		}
	};

	h5.core.expose(PageController);


})();