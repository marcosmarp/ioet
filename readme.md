# Shifts Billing Solution

## This program calculates the total billing for each employee based on their shift times and the rates applied to those shifts. It reads a text file with employee shifts and outputs the result in a list.

### Architecture

The solution consists of a single JavaScript file that runs in the browser. It uses vanilla JavaScript and HTML/CSS for the user interface. The program reads a text file with employees shifts and calculates the billing based on the shifts duration and the rates applied.

### Approach and Methodology

The program reads the input file and checks each line for validity using a regular expression. It then extracts the relevant information, such as the employee name, the day of the week, the start and end time of the shift, and the shift's duration.

Next, the program looks up the rate that applies to the shift. If the shift does not fall within any of the predefined rate ranges, the program splits the shift into two segments and applies the appropriate rate to each segment.

The program then calculates the total cost of the shift, based on the rate and whether the shift falls on a weekend. Finally, it aggregates the billing totals for each employee and displays them in a list.

### How to Run the Program Locally

-   Clone the repository or download the index.html and script.js files.
-   Open the index.html file in a web browser.
-   Click the "Choose File" button and select a text file with the input data.
-   The program will automatically read the file and display the billing totals for each employee in a list below the input form.

Note: The input file must have the following format:

-   Each line must contain an employee name and one or more shifts.
-   Employee names and shifts must be separated by an equal sign (=).
-   Shifts must be separated by commas (,).
-   Each shift must have the following format: <day code><start time>-<end time>. For example: MO08:00-17:00,TU09:00-15:00.
-   Day codes are two-letter abbreviations for the days of the week (MO, TU, WE, TH, FR, SA, SU).
-   Start and end times are in 24-hour format (HH:MM).
-   Shifts may span multiple days.
