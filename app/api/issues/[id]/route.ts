import { issueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const body = await request.json();
    const validation = issueSchema.safeParse(body);
    if(!validation.success) {
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const { id } = await params;
   const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!issue) {
        return NextResponse.json({error: "Invalid issue"}, {status: 404});
    }

    const updatedIssue = await prisma.issue.update({
        where: {
            id: issue.id 
        },
        data: validation.data
    });

    return NextResponse.json(updatedIssue);
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

     const { id } = await params;
   const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!issue) {
        return NextResponse.json({error: "Invalid issue"}, {status: 404});
    }

    await prisma.issue.delete({
        where: {
            id: parseInt(id)
        }
    })

    return NextResponse.json({});
}