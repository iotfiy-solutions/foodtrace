
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    TextField,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { InfluxDB } from "@influxdata/influxdb-client";

/**
 * Props:
 *  - open (bool)
 *  - onClose() 
 *  - measurement (string) default from env
 *  - bucket (string) default from env
 *  - fields (array) fields to fetch -> default ['temperature','odor','humidity','NH3','H2S']
 */
export default function DownloadModal({
    open,
    onClose,
    measurement = null,
    bucket = import.meta.env.VITE_INFLUX_BUCKET,
    fields = ["temperature", "humidity"],
}) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [singleDay, setSingleDay] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");

    // Create Influx client once
    const influxUrl = import.meta.env.VITE_INFLUX_URL;
    const influxToken = import.meta.env.VITE_INFLUX_TOKEN;
    const influxOrg = import.meta.env.VITE_INFLUX_ORG;

    const queryInflux = async (startISO, endISO) => {
        if (!influxUrl || !influxToken || !influxOrg) {
            throw new Error("Influx env vars are not set (VITE_INFLUX_URL/TOKEN/ORG).");
        }

        const client = new InfluxDB({ url: influxUrl, token: influxToken });
        const queryApi = client.getQueryApi(influxOrg);

        // build flux query
        const fieldFilter = fields
            .map((f) => `r._field == "${f}"`)
            .join(" or ");

        const flux = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startISO}"), stop: time(v: "${endISO}"))
  |> filter(fn: (r) => r._measurement == "${measurement}" and (${fieldFilter}))
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> keep(columns: ["_time", ${fields.map((f) => `"${f}"`).join(", ")}])
  |> sort(columns: ["_time"])
`;
        console.log({
            influxUrl,
            influxOrg,
            bucket,
            measurement,
            startISO,
            endISO
        });


        // collect rows (array of objects)
        const result = await queryApi.collectRows(flux);
        console.log("result>", result);
        return result;
    };

    const handleFetch = async () => {
        setError("");
        setRows([]);
        if (!startDate) {
            setError("Please select a start date.");
            return;
        }

        const start = new Date(startDate);
        let end;

        if (!singleDay) {
            if (!endDate) {
                setError("Please select an end date or toggle Single Day.");
                return;
            }
            end = new Date(endDate);
        } else {
            end = new Date(start);
        }

        // Always set end to end of the day
        end.setHours(23, 59, 59, 999);


        // convert to ISO strings for flux (RFC3339)
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        setLoading(true);
        try {
            const data = await queryInflux(startISO, endISO);
            // data is array of objects: { _time: "...", temperature: 20, odor: 1.2, ... }
            // normalize times to ISO and store
            const normalized = data.map((r) => ({
                time: r._time || r.time || r._time,
                ...fields.reduce((acc, f) => {
                    acc[f] = r[f] !== undefined ? r[f] : "";
                    return acc;
                }, {}),
            }));
            setRows(normalized);
            if (!normalized.length) setError("No data found for the selected range.");
        } catch (err) {
            setError("Failed to fetch data: " + (err.message || err));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadCsv = () => {
        if (!rows.length) {
            setError("No data to download. Fetch data first.");
            return;
        }
        // build CSV
        const header = ["time", ...fields];
        const csvRows = [header.join(",")];
        for (const r of rows) {
            const line = [r.time, ...fields.map((f) => (r[f] === null || r[f] === undefined ? "" : r[f]))];
            // escape commas/quotes simple way
            csvRows.push(line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
        }
        const csv = csvRows.join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const startPart = startDate ? new Date(startDate).toISOString().slice(0, 10) : "start";
        const endPart = (singleDay ? startPart : endDate ? new Date(endDate).toISOString().slice(0, 10) : "end");
        a.download = `influx_${measurement}_${startPart}_to_${endPart}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClose = () => {
        // reset if you prefer
        setRows([]);
        setError("");
        setLoading(false);
        onClose?.();
    };

    return (
        <Dialog open={!!open} onClose={handleClose} maxWidth="lg" fullWidth>
            <div className="flex items-center justify-between py-2">
                <DialogTitle sx={{ fontWeight: "bold", color: "grey.900" }}>Export data</DialogTitle>
                <img src="/logo-half.png" alt="IOTFIY Logo" className="h-[3rem] md:h-[4rem] w-[5rem] md:w-[6rem] pr-5" />
            </div>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2} mt={2}>
                        <DatePicker
                            label="Start date"
                            value={startDate}
                            onChange={(d) => setStartDate(d)}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                        <DatePicker
                            label="End date"
                            value={endDate}
                            onChange={(d) => setEndDate(d)}
                            disabled={singleDay}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={singleDay} onChange={(e) => setSingleDay(e.target.checked)} />}
                            label="Single day"
                        />
                        <Box flexGrow={1} py={4} />
                        <Button variant="contained" onClick={handleFetch} disabled={loading}>
                            Show data
                        </Button>
                    </Box>
                </LocalizationProvider>

                {error && (
                    <Typography color="error" variant="body2" mb={1}>
                        {error}
                    </Typography>
                )}


                <Box mt={2}>
                    <Typography variant="subtitle2" mb={1}>
                        Results ({rows.length})
                    </Typography>
                    <Box
                        mt={1}
                        sx={{
                            maxHeight: 400,
                            minHeight: 120,
                            overflowY: "auto",
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            fontWeight: 700,
                                            backgroundColor: "grey.100",
                                            color: "common.dark",
                                            zIndex: 2,
                                        }}
                                    >
                                        Time
                                    </TableCell>
                                    {fields.map((f) => (
                                        <TableCell
                                            key={f}
                                            align="right"
                                            sx={{
                                                position: "sticky",
                                                top: 0,
                                                fontWeight: 700,
                                                backgroundColor: "grey.100",
                                                color: "common.dark",
                                                zIndex: 2,
                                            }}
                                        >
                                            {f.toUpperCase()}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((r, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "grey.100" },
                                            "&:hover": { backgroundColor: "grey.200" },
                                        }}
                                    >
                                        <TableCell>{new Date(r.time).toLocaleString()}</TableCell>
                                        {fields.map((f) => (
                                            <TableCell key={f} align="right">
                                                {r[f] !== undefined ? r[f] : ""}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {loading && (
                            <Box display="flex" justifyContent="center" mt={2} py={1}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                </Box>



            </DialogContent>
            <DialogActions>
                <Button onClick={downloadCsv} disabled={!rows.length || loading}>
                    Save CSV
                </Button>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
