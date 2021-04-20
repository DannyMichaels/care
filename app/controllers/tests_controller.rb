class TestsController < ApplicationController
 # GET /tests
  
  def index

  @tests = { "one" => {
    "test" => "eins"
    }, "two" => "zwei", "three" => "drei" }

    @my_object = { :array => [1, 2, 3, { :sample => "hash"}, 44455, 677778, 9900 ], :foo => "bar", rrr: {"pid": 63, "state": false}}
   render json: @my_object
  end
end
