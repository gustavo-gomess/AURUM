-- CreateIndex
CREATE INDEX "comments_lesson_id_idx" ON "public"."comments"("lesson_id");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "public"."comments"("parent_id");

-- CreateIndex
CREATE INDEX "comments_lesson_id_parent_id_idx" ON "public"."comments"("lesson_id", "parent_id");
