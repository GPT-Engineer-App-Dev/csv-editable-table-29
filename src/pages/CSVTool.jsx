import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { readString } from "react-papaparse";
import { CSVLink } from "react-csv";

const CSVTool = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = readString(text, { header: true });
      setHeaders(parsedData.meta.fields);
      setData(parsedData.data);
    };
    reader.readAsText(file);
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">CSV Upload, Edit, and Download Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button onClick={handleAddRow} className="mt-4">Add Row</Button>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Input
                    value={row[header] || ""}
                    onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CSVLink data={data} headers={headers} filename="edited_data.csv">
        <Button className="mt-4">Download CSV</Button>
      </CSVLink>
    </div>
  );
};

export default CSVTool;