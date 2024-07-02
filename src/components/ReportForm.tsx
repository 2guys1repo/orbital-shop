"use client"

import React, { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import DropdownSelect from "@/components/ui/dropdown-select"
// import { addReport, updateReport } from "@/app/_actions/report"
import { ReportType } from "@/lib/types"
import { useFormState, useFormStatus } from "react-dom"
import UploadDropzone from "./UploadDropzone"

// use later when backend added
type ReportFormProps = {
    report?: ReportType,
}

export default function ReportForm({ report }: ReportFormProps) {
  // sets formAction to reportProduct for creating new report or updateReport for editing report
  // use later when backend added
  //const formAction = report == undefined ? addReport : updateReport.bind(null, product.id)
  //const [error, action] = useFormState(formAction, {})
  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const options = [
    { value: 'Product Faulty', label: 'ProductFaulty' },
    { value: 'Product Not As Described', label: 'ProductNotAsDescribed'},
    { value: 'Product Did Not Arrive', label: 'ProductDidNotArrive'},
    { value: 'Other', label: 'Other'},
  ];

  return (
    <form>
      <Card className="min-w-max w-1/2 mx-auto" >
        <CardHeader>
            <>
              <CardTitle>Report Order</CardTitle>
              <CardDescription>Fill out the form to report the order</CardDescription>
            </>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason: </Label>
            <DropdownSelect options={options} selectedOption={selectedOption} onOptionChange={handleOptionChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea className="mt-1" id="description" name="description" placeholder="Elaborate on your report" rows={3} required />
          </div>
          <div>
            <Label htmlFor="reportImage">Add an image of the issue being reported</Label>
            <UploadDropzone />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4" >
          <SubmitButton />
        </CardFooter>
      </Card>
    </form >
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
