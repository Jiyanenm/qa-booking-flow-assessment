| ID   | Title                              | Steps                                      | Expected Result                      | Type     |
|------|------------------------------------|-------------------------------------------|-------------------------------------|----------|
| TC01 | Valid postcode lookup              | Enter SW1A 1AA → click lookup             | 12+ addresses displayed             | Positive |
| TC02 | Invalid postcode format            | Enter "123" → lookup                      | Validation error shown              | Negative |
| TC03 | Empty postcode field               | Click lookup without input                | Required field error                | Negative |
| TC04 | Postcode with spaces normalization | Enter "SW1A 1AA"                          | Sent as SW1A1AA in API              | Edge     |
| TC05 | Postcode lowercase input           | Enter "sw1a 1aa"                          | Normalized & accepted               | Edge     |
| TC06 | Empty address result               | Enter EC1A 1BB                            | Show "No addresses found"           | Edge     |
| TC07 | API failure on lookup              | Enter BS1 4DJ                             | Error message displayed             | API      |
| TC08 | Retry after failure                | Click retry after BS1 4DJ failure         | Success response shown              | State    |
| TC09 | Loading state visible              | Enter M1 1AE                              | Spinner displayed before results    | State    |
| TC10 | Manual address entry               | Select manual entry                       | Address form displayed              | Positive |
| TC11 | Select address from list           | Choose first address                      | Address selected successfully       | Positive |
| TC12 | Waste type selection - general     | Select General Waste                      | Proceed to next step                | Positive |
| TC13 | Waste type selection - heavy       | Select Heavy Waste                        | Proceed to next step                | Positive |
| TC14 | Waste type selection - plasterboard| Select Plasterboard                       | Show 3 additional options           | Positive |
| TC15 | Plasterboard option required       | Select plasterboard without option        | Error shown                         | Negative |
| TC16 | Plasterboard option selection      | Choose option A                           | Proceed successfully                | Positive |
| TC17 | Skip list loads                    | Proceed to skip step                      | 8+ skips displayed                  | Positive |
| TC18 | Disabled skips visible             | Heavy waste selected                      | Certain skips disabled              | State    |
| TC19 | Disabled skip not clickable        | Click disabled skip                       | No selection occurs                 | Negative |
| TC20 | Skip price displayed               | View skip options                         | Price shown for each                | Positive |
| TC21 | Skip selection works               | Select 4-yard skip                        | Selected state applied              | Positive |
| TC22 | Skip normalization query           | Check API call                            | Query uses normalized postcode      | Edge     |
| TC23 | Review page loads                  | Complete previous steps                   | Summary displayed                   | Positive |
| TC24 | Price breakdown visible            | View review step                          | Base + total shown                  | Positive |
| TC25 | Confirm booking success            | Click confirm                             | Booking success message             | Positive |
| TC26 | Prevent double submit              | Double click confirm                      | Only one request sent               | Edge     |
| TC27 | Confirm API failure                | Simulate failure                          | Error shown                         | API      |
| TC28 | Retry confirm booking              | Retry after failure                       | Booking succeeds                    | State    |
| TC29 | Back navigation works              | Go back from step 3                       | Previous data retained              | State    |
| TC30 | Refresh mid-flow                   | Refresh page                              | State resets or persists correctly  | Edge     |
| TC31 | Mobile responsiveness              | Open on mobile                            | Layout adjusts properly             | UI       |
| TC32 | Accessibility labels               | Inspect inputs                            | Proper labels present               | UI       |
| TC33 | Error message clarity              | Trigger error                             | Clear user-friendly message         | UX       |
| TC34 | Latency handling UX                | Slow API                                  | Loader persists correctly           | UX       |
| TC35 | Invalid skip API response          | Corrupt data                              | Graceful fallback UI                | API      |
| TC36 | Multiple retries                   | Fail twice → retry                        | Handles retries safely              | Edge     |
| TC37 | Session timeout simulation         | Idle user                                 | Prompt or reset flow                | Edge     |