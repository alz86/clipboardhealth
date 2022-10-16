# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables

- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each

- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions:

- Since a part of the description reads: "We're working on a new feature which will generate reports for our client Facilities" I assume that the feature development is in progress, and so it is not yet released to the system. Thus, no legacy compatibility in reports is required since nobody has been using the system yet.
- The inclusion of the Facility's custom Id is optional. Thus any agent may or may not have a custom Id.
- Since Facility Id value is optional, we still include our system id in the reports to help identify Agents when they don't have a custom Id.
- There is a UI page where the Facility can configure the report to generate.
- While the name of the methods involved in the report's creation is given, it is not clear who calls them, if a page, service, another class, etc. I assume a method already calls them in the proper sequence.

## Task 1:

**Title**: **_Update database model and save Facilities' agent id_**
**Description**:
We need to modify the DB schema to allow storing, for every agent, its Facility's Custom Id. Note that this field is optional, so ensure that everything works if the Facility provided it as it didn't. The field type is VARCHAR(255) (NOTE: assumption).
Note that this task also includes updating all related methods that save/retrieve information to upper system's layers.

- For saving methods
  - Ensure that in the create and update methods the caller has the option to set Agent's Custom Id.
  - For data retrieving methods, ensure this value is NOT returned yet. We will later update the methods where this value could be used. Do not return to all the other ones to avoid unexpected errors.

**Acceptance criteria**:

- Agent's table can optionally store a Custom Id value for every entity.
- Agent's create and update methods allows setting a value for this field.
- Select methods return the same information as before this change was implemented.

**Estimated effort (hours)**: 6

## Task 2

**Title**: **_Update method getting shift information._**
**Description**:
Update the method getShiftByFacilities to add the ability to configure whether the user wants to include our System Id (Agent's table Identity value) and/or Facility's custom Id (new id field added). Any combination of those values can be supplied, including not include any ID value at all.
Remember also to update the unit tests associated with this method.

**Acceptance criteria**:

- The method getShiftsByFacility can be called indicating whether the information to return includes or not the System's Id and/or the Custom one.
- Unit tests were updated to include the new cases, and they pass.

**Estimated effort (hours)**: 2
**Dependant task**: Task 1

## Task 3

**Title**: **_Update method generating PDF report._**
**Description**:
Update the method generateReport to consider the inclusion or not of the System and Custom Ids in the data coming from getShiftsByFacility. The place of the System Id column is the same as it has now, and the site for Custom Id is after that column.
Remember to update unit tests associated with this method.

**Acceptance criteria**:

- The method generates the final PDF, including the information for System and Custom Ids based on what it received as a parameter.
- Unit tests were updated to include the new options, and they pass.

**Estimated effort (hours)**: 2
**Dependant task**: Task 2

## Task 4

**Title**: **_Update reports page ._**
**Description**: We need to update the reports page to allow the users to select whether they want to include their Facility Custom Id and/or our system's one in the report or not. Thus, a multi-select checkbox has to be included, with the options "Include System's Id" and "Include Custom Id". Based on the user's choice, call the report generation method with the right parameters.

**Acceptance criteria**:

- Reports page shows the new multi-select checkbox to allow the user to choose the information to include in the report.
- The report is generated based on the options selected on that new control.

**Estimated effort (hours)**: 4
**Dependant task**: Task 2.
