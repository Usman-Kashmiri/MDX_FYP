<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Models\MilestoneStage;
use App\Models\MilestoneStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MilestoneController extends Controller
{
    // Get Contract's Milestone Stages along with steps
    public function index(Request $request, int $id)
    {
        try {

            // If the status is set... (e.g: stages that are completed or pending)
            if (isset($request->status)) {
                $stages = MilestoneStage::with('steps')->where(['contract_id' => $id, 'status' => $request->status])->get();
            }

            // If the step's status is set... (e.g: steps that are completed or pending)
            elseif (isset($request->steps_status)) {
                $stepStatus = $request->steps_status;

                $stages = MilestoneStage::with([
                    'steps' => function ($query) use ($stepStatus) {
                        $query->where('status', $stepStatus);
                    },
                ])->where('contract_id', $id)->get();
            } else {
                $stages = MilestoneStage::with('steps')->where('contract_id', $id)->get();
            }

            if (count($stages) > 0) {

                // Check if all steps in each stage are completed
                foreach ($stages as $stage) {
                    $allStepsCompleted = $stage->steps->every(function ($step) {
                        return $step->status === 'completed';
                    });

                    // If all steps are completed, update the stage's status to 'completed'
                    if ($allStepsCompleted) {
                        $stage->update(['status' => 'completed']);
                    } else {
                        $stage->update(['status' => 'pending']);
                    }
                }


            }
            return response()->json([
                "res" => "success",
                "message" => "Milestone Stages Found Successfully!",
                "data" => $stages
            ]);
            //code...
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
            ]);
        }
    }

    // Create Milestone Stage
    public function create_milestone_stage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "contract_id" => 'required|exists:contracts,id',
            "name" => 'required',
            "description" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $record = MilestoneStage::create([
                "contract_id" => $request->contract_id,
                "name" => $request->name,
                "description" => $request->description
            ]);

            if (!empty($record)) {

                return response()->json([
                    "res" => "success",
                    "message" => "Milestone Stage created Successfully!",
                ]);
            } else {

                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Create Milestone Stage!",
                ]);
            }
        }
    }

    // Get Milestone's steps
    public function get_milestone_steps(int $id)
    {
        try {

            $steps = MilestoneStep::where('stage_id', $id)->get();

            if (count($steps) > 0) {

                return response()->json([
                    "res" => "success",
                    "message" => "Milestone Steps Found Successfully!",
                    "data" => $steps
                ]);
            } else {

                return response()->json([
                    "res" => "success",
                    "message" => "Milestone Steps Found Successfully!",
                    "data" => []
                ]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
            ]);
        }
    }

    // Create Milestone Step
    public function create_milestone_step(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                "stage_id" => 'required|exists:milestone_stages,id',
                "name" => 'required',
                "description" => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
            MilestoneStep::create([
                "stage_id" => $request->stage_id,
                "name" => $request->name,
                "description" => $request->description
            ]);


            return response()->json([
                "res" => "success",
                "message" => "Milestone Steps created Successfully!",
            ]);

            //code...
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
            ]);
        }
    }

    // Update Milestone Step Status
    public function update_step_status(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "status" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $step = MilestoneStep::where('id', $id)->first();

            $step->status = $request->status;
            $isUpdated = $step->save();


            if (!empty($isUpdated)) {

                return response()->json([
                    "res" => "success",
                    "message" => "Milestone Step's Status Updated Successfully!",
                ]);
            } else {

                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Milestone Step's Status!",
                ]);
            }
        }
    }
}
