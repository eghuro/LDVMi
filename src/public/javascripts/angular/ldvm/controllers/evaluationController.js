define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Evaluate', [
            '$scope', '$routeParams', 'Pipelines', '$connection',
            function ($scope, $routeParams, pipelines, $connection) {

                $scope.info = [];
                $scope.isFinished = false;
                $scope.duration = 0;

                var id = null;

                var l = window.location;
                var isSsl = l.protocol === 'https:';
                var wsProtocol = isSsl ? "wss" : "ws";
                var connection = $connection(wsProtocol + "://" + l.host + "/api/v1/pipelines/evaluate/" + $routeParams.id);
                connection.listen(function () {
                    return true
                }, function (data) {
                    $scope.$apply(function () {
                        $scope.info.unshift(data);

                        if (data.message && data.message == "==== DONE ====") {
                            $scope.info.unshift({});
                            $scope.info.unshift({message: "Pipeline evaluation is done. You are being redirected."});

                            if (parseInt($routeParams.autorun) === 1) {
                                window.location.href = "/visualize/" + id;
                            } else {
                                window.location.href = "/pipelines#/detail/" + $routeParams.id;
                            }
                        }

                        if (data.id) {
                            id = parseInt(data.id);
                        }

                        if ("isFinished" in data) {
                            $scope.isFinished = data.isFinished;
                            $scope.isSuccess = data.isSuccess;

                            if ("createdUtc" in data && "modifiedUtc" in data) {
                                $scope.duration = data.modifiedUtc - data.createdUtc;
                            }
                        }
                    });
                });
            }

        ]);
});
