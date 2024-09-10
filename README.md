# ZoneShift

ZoneShift is a simple time zone conversion web app. It allows users to easily compare times across different time zones and view annual time shifts due to Daylight Saving Time (DST) changes.

## Features

- Compare times across multiple time zones
- View a snapshot of current times in different locations
- See annual time shifts, including DST changes
- Dark mode 
- Responsive design for desktop and mobile use

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/raphael-milliere/zoneshiftapp.git
   cd zoneshiftapp
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open a web browser and navigate to `http://localhost:5000` to use the application.

## Usage

1. Select a reference location from the dropdown menu.
2. Choose a date and time (the current date and time are set by default).
3. Click the "Convert" button to see the time comparison.
4. View the "Snapshot View" for immediate time comparisons and the "Annual Time Shifts" for yearly DST changes.
5. Toggle dark mode using the moon/sun icon in the top right corner.

## License

This project is open source and available under the [MIT License](LICENSE).
