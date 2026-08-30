#!/bin/bash
KEY="rg_d21b4cd5252145dd8c55ab340bb81029"
BASE="https://api.railradar.in/v1"

echo "=========================================================="
echo "UZZU RAIL TRACKER - ALL 16 RAILRADAR API VERTICAL AUDIT"
echo "=========================================================="
echo ""

run_test() {
  local name="$1"
  local url="$2"
  echo "Testing Vertical: [$name]"
  echo "URL: $url"
  res=$(curl -s -H "Authorization: Bearer $KEY" "$url")
  status=$(echo "$res" | grep -o '"success":true' || echo "FAILED")
  if [ "$status" = '"success":true' ]; then
    echo "Result: SUCCESS [OK]"
    echo "$res" | head -c 200
  else
    echo "Result: FAIL/FALLBACK NEEDED"
    echo "$res" | head -c 200
  fi
  echo ""
  echo "----------------------------------------------------------"
}

# Vertical 1: Live Train Tracker
run_test "Live Running Status" "$BASE/trains/12002/live?authoritative=true"
run_test "Train Schedule" "$BASE/trains/12002"
run_test "Route Geometry GIS" "$BASE/trains/12002/route"
run_test "Coach Composition" "$BASE/trains/12002/coaches"

# Vertical 2: PNR Status & Odds
run_test "10-Digit PNR Status" "$BASE/pnr/2451234567"
run_test "PNR Prediction Odds" "$BASE/pnr/2451234567/prediction"
run_test "PNR Cancellation Refund" "$BASE/pnr/2451234567/refund"

# Vertical 3: Live Station Board
run_test "Live Station Board" "$BASE/stations/NDLS/live"
run_test "Station Schedule Board" "$BASE/stations/NDLS/schedule"

# Vertical 4: Trains Between Stations
run_test "Trains Between Path Endpoint" "$BASE/trains/between/NDLS/MMCT"

# Vertical 5: Seat Availability & Fare Calculator
run_test "Seat Availability Forecast" "$BASE/trains/12952/availability?from=NDLS&to=MMCT&class=3A"
run_test "Train Fare Calculator" "$BASE/trains/fare?train=12952&from=NDLS&to=MMCT"

# Vertical 6: Suburban Local Networks
run_test "Suburban Local Trains" "$BASE/suburban/local?city=MUMBAI"
run_test "Suburban Cities List" "$BASE/suburban/cities"

# Autocomplete Lookups
run_test "Live Station Autocomplete" "$BASE/lookup/search/stations?q=NDLS&limit=5"
run_test "Live Train Autocomplete" "$BASE/lookup/search/trains?q=129&limit=5"
