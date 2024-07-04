"use server"

import prisma from "@/lib/db";
import { z } from "zod";
import { ReportStatus } from "@prisma/client";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { getAuthenticatedUser } from "./auth";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

// Schema describing a post form for a report
const postSchema = z.object({
    reason: z.string().min(1),
    description: z.string().min(1),
    imageKey: z.string().min(1),
});

// Create a new report in database
export async function addReport(orderId: number, userId: number, _prevState: unknown, formData: FormData) {
  const kindeUser = await getAuthenticatedUser();
  if (!kindeUser) throw new Error("Server issue, Unable to add product"); // Kinde server issue
  const result = postSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  
  // TODO: change userId to String
  const imagePath = "/" // hardcoded for now
  await prisma.report.create({
    data: {
        userId: userId,
        orderId: orderId,
        reason: data.reason,
        description: data.description,
    }
  });
  revalidatePath("/");
  redirect("/");
}

const updateSchema = postSchema.extend({
    imageKey: z.string().optional(),
})

// TODO: add button to edit reports
export async function updateReport(id: number, _prevState: unknown, formData: FormData) {
    const kindeUser = await getAuthenticatedUser();
    if (!kindeUser) throw new Error("Server issue, Unable to add product"); // Kinde server issue
    const result = updateSchema.safeParse(Object.fromEntries(formData.entries()))

    if (result.success === false) {
      return result.error.formErrors.fieldErrors;
    }
  
    const data = result.data;
    const report = await prisma.report.findFirst({ where: { id } });
    if (!report) return notFound();
  
    // TODO: Add image feature
    // let imagePath = report.imagePath;
    // const utapi = new UTApi();
    // if (data.prevPath && data.imageKey) { // delete prevpath
    //   await utapi.deleteFiles(data.prevPath)
    //   imagePath = `https://utfs.io/f/${data.imageKey}`  // new image path
    // }

    await prisma.report.update({
      where: { id },
      data: {
        reason: data.reason,
        description: data.description,
        // add more details, orderReported missing
        // imagePath: imagePath,
      }
    })
    revalidatePath("/")
}

export async function updateReportStatus(id: number, nextStatus: ReportStatus) {
    // TODO: only allow admins to update
    await prisma.report.update({
      where: { id },
      data: {
        status: nextStatus
      }
    })
  }

  // Gets the relevant details for a report
export async function getReportDetailsById(id: number) {
    const report = await prisma.report.findUniqueOrThrow({
      where: { id },
    })

    const transformedReport = {
        id: id,
        orderId: report.orderId,
        reportDate: report.reportDate.toLocaleDateString(),
        reason: report.reason,
        description: report.description,
        status: report.status,
        imagePath: "/", // hardcode for now
    }
    return transformedReport;
  }

  // Gets all reports, with necessary fields, of user
export async function getReportsOfUser(user: KindeUser) {
  // TODO: update userId to String
  const rawReports = await prisma.report.findMany({
    where: {
      userId: 12
    }
  });

  const transformedReports = rawReports.map(report => {
    return {
      id: report.id,
      reason: report.reason,
      reportStatus: report.status,
      reportDate: report.reportDate.toLocaleDateString(),
    }
  })

  return transformedReports;
}