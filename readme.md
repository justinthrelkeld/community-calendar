Super Calendar (working title) is a publishing platform for community events. User-focused, mobile-friendly, and strategic.

There are three reasons for this project:
  1. I think that a community calendar is important to the strength of that community.
  2. Publishing is an interesting area of focus that I want to explore in a hands-on way.
  3. I want to expand, sharpen, and demonstrate my coding skills.

# Objective
The primary objective of this project is to build a fantastically well-designed community calendar. Core components will include user accounts, a submission mechanism, deep Facebook and other social integration for event promotion (possibly analytics?), multi-level permissions (editors, contribuitors), paid promotional oportunities...

# How to... 
The final product is a static web application housed in `/app`. The app can be hosted via GitHub pages. For an explaination on how that works, see the fantastic [GitHub Pages Documentation][GitHub pages].

The application source is compiled and run with Middleman. To run the source app, run `$ middleman` (Assuming middleman is installed). See the Middleman getting started guide for [installation instructions][installing middleman].

These instructions will continue to improve as the project matures. We may even switch over to using Jekyll for its [easy-peasy GitHub Pages integration][Jekyll]. See [issue #9] for a discussion of this possible path.

[GitHub pages]: https://help.github.com/articles/creating-project-pages-manually
[installing middleman]: http://middlemanapp.com/basics/getting-started/#toc_1
[Jekyll]: http://jekyllrb.com/docs/github-pages/
[issue #9]: https://github.com/justinthrelkeld/community-calendar/issues/9

# Project Phases
The project will be broken up into several large phases to allow things to get moving quickly and gracefully scale to provide more functionality.

## Phase 1 - Flat Calendar
Phase one will focus on the creation of a robust, single page calendar application.

Requirements:
  - Must run all interaction on the client side.
  - Must be easy to use. Interface is a top priority.
  - Must be semantic.
  - Must be search engine friendly.
  - Must make use of currently accepted best-practices.
  - Should be easy to keep updated.
  - Should be aware of whether an event has passed.
  - Should include some form of search/filtering mechanisim.
  - Adding this new item to show pull request workflow.

## Phase 2
Phase two will expand on the previous flat calendar, adding server side capibilities and refining the UX.

Requirements:
  - Must be cloud deployed.
  - Will likely be written in Ruby and/or Node.
  - Should include some low-level form of advertising or monetization.
  - Must have moderately sophisticated filtering and search: geo radius?, category/tag, cost.

# Phase 3
Phase three will focus on bringing the calendar application into a viable state. Users should be able to directly contribute to the site, sign up for reminders, and recieve personalization. Additionally, business-side features will be further developed in this phase.

Requirements:
  - Should capture rich user data.
  - Must provide advancesd monetization opportunities.
  - Must provide user personalization / user accounts.
  - Must provide user permissions: Contributor / Manager.